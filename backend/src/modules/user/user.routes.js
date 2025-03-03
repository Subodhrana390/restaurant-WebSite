import { Router } from "express";
import { uploadSingleFile } from "../../../multer/multer.js";
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserById,
  getUserProfile,
} from "./user.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const userRouter = Router();

userRouter.get("/", protectedRoutes, allowedTo("admin"), getAllUsers);
userRouter.get("/profile", protectedRoutes, getUserProfile);
userRouter.get("/:id", getUserById);
userRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("customer", "admin"),
  uploadSingleFile("profileImage", "customer"),
  updateUserById
);
userRouter.patch(
  "/change-password",
  protectedRoutes,
  allowedTo("customer"),
  changePassword
);
userRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("customer", "admin"),
  deleteUser
);

export default userRouter;
