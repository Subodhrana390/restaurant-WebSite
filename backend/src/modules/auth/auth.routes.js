import { Router } from "express";
import { createUser, loginUser, refreshTokenHandler } from "./auth.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";

const authRouter = Router();

authRouter.post(
  "/create",
  uploadSingleFile("profileImage", "customer"),
  createUser
);
authRouter.post("/login", loginUser);

authRouter.post("/refresh-token", refreshTokenHandler);

export default authRouter;
