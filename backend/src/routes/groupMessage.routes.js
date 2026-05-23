import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";
import { clearGroupChat, deleteGroupMessage, getAllUsersForGroup, getGroupMessages, markGroupMessageSeen, sendGroupMessage } from "../controllers/groupMessage.controller.js";

const groupMessageRouter = express.Router();

//Route to send a group message
groupMessageRouter.post("/send/:groupId", authMiddleware, upload.single("image"), sendGroupMessage);
//Route to get all the users for a group
groupMessageRouter.get("/all-users", authMiddleware, getAllUsersForGroup);
//Route to delete a message in group.
groupMessageRouter.delete("/delete/:messageId", authMiddleware, deleteGroupMessage);
//Route to clear all the group messages.
groupMessageRouter.delete("/clear-messages/:groupId", authMiddleware, clearGroupChat);
//Route to mark messages of a group as seen.
groupMessageRouter.patch("/mark-seen/:groupId", authMiddleware, markGroupMessageSeen);
//Route to get all the messages for a group
groupMessageRouter.get("/:groupId", authMiddleware, getGroupMessages);

export default groupMessageRouter;