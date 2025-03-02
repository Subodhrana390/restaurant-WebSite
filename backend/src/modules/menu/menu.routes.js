import { Router } from "express";
import {
  addReview,
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getMenuByCategory,
  getMenuItemById,
  updateMenuItem,
} from "./menu.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";

const menuRouter = Router();
// Define routes
menuRouter.post("/", uploadSingleFile("image", "menu"), createMenuItem);
menuRouter.get("/", getAllMenuItems);
menuRouter.get("/:id", getMenuItemById);
menuRouter.put("/:id", uploadSingleFile("image", "menu"), updateMenuItem);
menuRouter.delete("/:id", deleteMenuItem);
menuRouter.post("/:id/review", addReview);
menuRouter.get("/category/:category", getMenuByCategory);

export default menuRouter;
