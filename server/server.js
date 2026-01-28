import express from "express"
import cors from "cors"

const PORT = process.env.PORT || 3000

const app = express()

// Middlewares
app.use(cors())
app.use(express())

// Routes
app.get("/", (req, res) => res.send("Server is Live!"))

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})