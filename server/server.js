import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import connectDB from "./configs/db.js"

const PORT = process.env.PORT || 3000

const app = express()

await connectDB()

// Middlewares
app.use(cors())
app.use(express())

// Routes
app.get("/", (req, res) => res.send("Server is Live!"))

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})