import express from "express";
import { registerUser, loginUser } from "./auth.service.js";

const router = express.Router();

import { loginUser as loginUserHelper } from "./auth.service.js";

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const user = await registerUser(email, password);
    const loginData = await loginUserHelper(email, password);
    res.status(201).json({ message: "User registered successfully", ...loginData });
  } catch (error) {
    if (error.code === "23505") { // Unique violation in Postgres
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    const data = await loginUser(email, password);
    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
