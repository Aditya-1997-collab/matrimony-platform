require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { postgraphile } = require("postgraphile")

const app = express()

app.use(cors())
app.use(express.json())

// PostGraphile automatically exposes your DB as API
app.use(
  postgraphile(
    process.env.DATABASE_URL,
    "public",
    {
      graphiql: true,
      enhanceGraphiql: true,
      enableCors: true
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
