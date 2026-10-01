import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { postgraphile } from "postgraphile"
import authRoutes from "./src/auth.routes.js"
import onboardingRoutes from "./src/onboarding.routes.js"
import profileRoutes from "./src/profile.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/onboarding", onboardingRoutes)
app.use("/profile", profileRoutes)

// PostGraphile automatically exposes your DB as API
app.use(
  postgraphile(
    process.env.DATABASE_URL,
    "public",
    {
      graphiql: true,
      enhanceGraphiql: true,
      enableCors: true,
      pgDefaultRole: 'app_user'
    }
  )
)

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
  res.send("Matrimony backend running ✅")
})

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
