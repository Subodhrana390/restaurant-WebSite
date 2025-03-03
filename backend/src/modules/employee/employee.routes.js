import { Router } from "express";
import {
  allowedTo,
  createEmployee,
  loginEmployee,
  protectedRoutes,
} from "../auth/auth.controller.js";
import { uploadSingleFile } from "../../../multer/multer.js";
import {
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  getEmployeeProfile,
} from "./employee.controller.js";

const employeeRouter = Router();

employeeRouter.post(
  "/",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("profileImage", "employee"),
  createEmployee
);
employeeRouter.post("/login", loginEmployee);

employeeRouter.get("/profile", protectedRoutes, getEmployeeProfile);
employeeRouter.get("/", protectedRoutes, allowedTo("admin"), getAllEmployees);
employeeRouter.get(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  getEmployeeById
);
employeeRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  uploadSingleFile("profileImage", "employee"),
  updateEmployeeById
);
employeeRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  deleteEmployee
);

export default employeeRouter;
