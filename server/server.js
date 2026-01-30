import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import connectDB from "./configs/db.js"
import userRouter from "./routes/userRouter.js";
import chatRouter from "./routes/chatRoutes.js";

const PORT = process.env.PORT || 3000

const app = express()

await connectDB()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get("/", (req, res) => res.send("Server is Live!"))
app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})