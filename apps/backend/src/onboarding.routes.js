import express from "express";
import pool from "./db.js";
import { authenticateToken } from "./auth.middleware.js";

const router = express.Router();

router.post("/submit", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const {
    full_name,
    gender,
    date_of_birth,
    phone,
    profile_for,
    looking_for,
    religion,
    caste,
    sub_caste,
    education,
    career,
    income,
    marital_status,
    living_in,
    bio,
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Update users table
    const updateUserQuery = `
      UPDATE users
      SET full_name = COALESCE($1, full_name),
          gender = COALESCE($2, gender),
          date_of_birth = COALESCE($3, date_of_birth),
          phone = COALESCE($4, phone)
      WHERE id = $5
      RETURNING *;
    `;
    await client.query(updateUserQuery, [
      full_name,
      gender,
      date_of_birth ? new Date(date_of_birth) : null,
      phone,
      userId,
    ]);

    // 2. Check if profile exists, if so update, else insert
    const checkProfileQuery = `SELECT id FROM profiles WHERE user_id = $1;`;
    const profileCheck = await client.query(checkProfileQuery, [userId]);

    if (profileCheck.rows.length > 0) {
      const updateProfileQuery = `
        UPDATE profiles
        SET caste = $1,
            sub_caste = $2,
            education = $3,
            career = $4,
            income = $5,
            marital_status = $6,
            living_in = $7,
            bio = $8,
            managed_by = $9,
            profile_status = 'completed',
            updated_at = NOW()
        WHERE user_id = $10;
      `;
      await client.query(updateProfileQuery, [
        caste,
        sub_caste,
        education,
        career,
        income,
        marital_status,
        living_in,
        bio,
        profile_for || "self",
        userId,
      ]);
    } else {
      const insertProfileQuery = `
        INSERT INTO profiles (user_id, caste, sub_caste, education, career, income, marital_status, living_in, bio, managed_by, profile_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'completed');
      `;
      await client.query(insertProfileQuery, [
        userId,
        caste,
        sub_caste,
        education,
        career,
        income,
        marital_status,
        living_in,
        bio,
        profile_for || "self",
      ]);
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Onboarding data saved successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

export default router;
