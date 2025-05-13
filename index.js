import express from "express"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js API" })
})

// API endpoints
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello, world!" })
})

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
