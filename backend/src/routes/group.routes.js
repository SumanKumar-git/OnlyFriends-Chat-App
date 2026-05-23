import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";
import { addMemberToGroup, createGroup, deleteGroup, getAllGroups, getUserGroups, joinGroup, leaveGroup, removeMemberFromGroup, updateGroup } from "../controllers/group.controller.js";

const groupRouter = express.Router();

//Route to create a group.
groupRouter.post("/create", authMiddleware, upload.single("groupIcon"), createGroup);

//Route to add a member to a group.
groupRouter.patch("/add-member/:groupId", authMiddleware, addMemberToGroup);

//Route to remove a member from a group.
groupRouter.patch("/remove-member/:groupId", authMiddleware, removeMemberFromGroup);

//Route to join a group.
groupRouter.patch("/join/:groupId", authMiddleware, joinGroup);

//Route to leave a group.
groupRouter.patch("/leave/:groupId", authMiddleware, leaveGroup);

//Route to get all the groups.
groupRouter.get("/get-groups", authMiddleware, getAllGroups);

//Route to get all the groups the user is a member of.
groupRouter.get("/my-groups", authMiddleware, getUserGroups);

//Route to update a group.
groupRouter.patch("/update/:groupId", authMiddleware, upload.single("groupIcon"), updateGroup);

//Route to delete a group.
groupRouter.delete("/delete/:groupId", authMiddleware, deleteGroup);



export default groupRouter;