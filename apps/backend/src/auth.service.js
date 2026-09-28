import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_matrimony_123";

export const registerUser = async (email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at;
  `;
  
  const values = [email, passwordHash];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const loginUser = async (email, password) => {
  const query = `
    SELECT id, email, password_hash FROM users WHERE email = $1;
  `;
  
  const result = await pool.query(query, [email]);
  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }
  
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
  
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "24h",
  });
  
  return {
    user: { id: user.id, email: user.email },
    token,
  };
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
