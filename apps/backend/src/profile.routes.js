import express from "express";
import pool from "./db.js";
import { authenticateToken } from "./auth.middleware.js";

const router = express.Router();

/**
 * GET /profile/status
 * Get current user's profile status (whether they have a completed soulmate profile)
 */
router.get("/status", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    // Check if user has a profile
    const profileQuery = `
      SELECT 
        p.id,
        p.profile_status,
        p.managed_by,
        p.caste,
        p.sub_caste,
        p.education,
        p.career,
        p.income,
        p.marital_status,
        p.living_in,
        p.bio,
        p.created_at,
        u.full_name,
        u.gender,
        u.date_of_birth,
        u.email,
        u.phone
      FROM profiles p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = $1;
    `;
    
    const profileResult = await pool.query(profileQuery, [userId]);
    
    const hasProfile = profileResult.rows.length > 0;
    const profile = hasProfile ? profileResult.rows[0] : null;
    const isCompleted = hasProfile && profile.profile_status === 'completed';

    res.status(200).json({
      hasProfile,
      isCompleted,
      profile,
    });
  } catch (error) {
    console.error("Error fetching profile status:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /profile/explore
 * Get list of profiles to explore (for users who are signed in and have completed their profile)
 * Supports pagination and basic filtering
 */
router.get("/explore", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { 
    page = 1, 
    limit = 10, 
    gender, 
    minAge, 
    maxAge, 
    caste, 
    marital_status,
    location 
  } = req.query;

  try {
    // First check if current user has completed profile
    const profileCheck = await pool.query(
      `SELECT profile_status FROM profiles WHERE user_id = $1`,
      [userId]
    );

    if (profileCheck.rows.length === 0 || profileCheck.rows[0].profile_status !== 'completed') {
      return res.status(403).json({ 
        error: "You must complete your profile before exploring other profiles",
        code: "PROFILE_INCOMPLETE"
      });
    }

    // Get current user's gender to show opposite gender profiles (or same based on preference)
    const userQuery = await pool.query(
      `SELECT gender, date_of_birth FROM users WHERE id = $1`,
      [userId]
    );
    
    const currentUser = userQuery.rows[0];
    const currentUserGender = currentUser?.gender;

    // Build explore query
    let query = `
      SELECT 
        p.id,
        p.caste,
        p.sub_caste,
        p.education,
        p.career,
        p.income,
        p.marital_status,
        p.living_in,
        p.bio,
        p.profile_status,
        u.id as user_id,
        u.full_name,
        u.gender,
        u.date_of_birth,
        u.email,
        u.created_at
      FROM profiles p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id != $1
        AND p.profile_status = 'completed'
    `;
    
    const params = [userId];
    let paramIndex = 2;

    // Filter by gender (default to opposite gender)
    if (gender) {
      query += ` AND u.gender = $${paramIndex}`;
      params.push(gender);
      paramIndex++;
    } else if (currentUserGender) {
      // Default to opposite gender
      const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';
      query += ` AND u.gender = $${paramIndex}`;
      params.push(oppositeGender);
      paramIndex++;
    }

    // Filter by age range
    if (minAge) {
      query += ` AND u.date_of_birth <= (CURRENT_DATE - INTERVAL '${minAge} years')`;
    }
    if (maxAge) {
      query += ` AND u.date_of_birth >= (CURRENT_DATE - INTERVAL '${maxAge} years')`;
    }

    // Filter by caste
    if (caste) {
      query += ` AND p.caste ILIKE $${paramIndex}`;
      params.push(`%${caste}%`);
      paramIndex++;
    }

    // Filter by marital status
    if (marital_status) {
      query += ` AND p.marital_status = $${paramIndex}`;
      params.push(marital_status);
      paramIndex++;
    }

    // Filter by location
    if (location) {
      query += ` AND p.living_in ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    // Add ordering and pagination
    query += ` ORDER BY p.created_at DESC`;
    
    const offset = (Number(page) - 1) * Number(limit);
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(Number(limit), offset);

    const result = await pool.query(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) 
      FROM profiles p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id != $1
        AND p.profile_status = 'completed'
    `;
    
    const countParams = [userId];
    let countParamIndex = 2;

    if (gender) {
      countQuery += ` AND u.gender = $${countParamIndex}`;
      countParams.push(gender);
      countParamIndex++;
    } else if (currentUserGender) {
      const oppositeGender = currentUserGender === 'male' ? 'female' : 'male';
      countQuery += ` AND u.gender = $${countParamIndex}`;
      countParams.push(oppositeGender);
      countParamIndex++;
    }

    if (minAge) {
      countQuery += ` AND u.date_of_birth <= (CURRENT_DATE - INTERVAL '${minAge} years')`;
    }
    if (maxAge) {
      countQuery += ` AND u.date_of_birth >= (CURRENT_DATE - INTERVAL '${maxAge} years')`;
    }
    if (caste) {
      countQuery += ` AND p.caste ILIKE $${countParamIndex}`;
      countParams.push(`%${caste}%`);
      countParamIndex++;
    }
    if (marital_status) {
      countQuery += ` AND p.marital_status = $${countParamIndex}`;
      countParams.push(marital_status);
      countParamIndex++;
    }
    if (location) {
      countQuery += ` AND p.living_in ILIKE $${countParamIndex}`;
      countParams.push(`%${location}%`);
      countParamIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      profiles: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching explore profiles:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /profile/me
 * Get current user's full profile data
 */
router.get("/me", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const query = `
      SELECT 
        u.id,
        u.full_name,
        u.gender,
        u.date_of_birth,
        u.email,
        u.phone,
        u.created_at,
        p.id as profile_id,
        p.caste,
        p.sub_caste,
        p.education,
        p.career,
        p.income,
        p.height_cm,
        p.weight_kg,
        p.marital_status,
        p.living_in,
        p.bio,
        p.managed_by,
        p.profile_status,
        p.created_at as profile_created_at,
        p.updated_at as profile_updated_at
      FROM users u
      LEFT JOIN profiles p ON p.user_id = u.id
      WHERE u.id = $1;
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;