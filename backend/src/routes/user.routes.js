import express from "express";
import { userSignup, userLogin, checkAuth, updateProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.get("/check-auth", authMiddleware, checkAuth);
userRouter.put("/update-profile", authMiddleware, upload.single("profilePhoto"), updateProfile);

export default userRouter;