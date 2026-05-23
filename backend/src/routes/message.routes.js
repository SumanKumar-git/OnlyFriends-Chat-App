import express from "express";
import upload from "../middleware/multer.js";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {getAllUser, getMessages, sendMessage, markMessagesSeen, deleteSingleMessage} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", authMiddleware, getAllUser);
messageRouter.get("/:senderId", authMiddleware, getMessages);
messageRouter.post("/send/:receiverId", authMiddleware, upload.single("image"), sendMessage);
messageRouter.put("/mark-seen/:senderId", authMiddleware, markMessagesSeen);
messageRouter.delete("/delete/:messageId", authMiddleware, deleteSingleMessage);

export default messageRouter;