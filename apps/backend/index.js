import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import { postgraphile } from "postgraphile"

const app = express()

app.use(cors())
app.use("/auth", express.json())

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
