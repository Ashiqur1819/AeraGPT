import express from "express"
import { protect } from "../middlewares/auth.js"
import { generateImageMessage, generateTextMessage } from "../controllers/messageController.js"

const messageRouter = express.Router()

messageRouter.post("/text", protect, generateTextMessage)
messageRouter.post("/image", protect, generateImageMessage)

export default messageRouter