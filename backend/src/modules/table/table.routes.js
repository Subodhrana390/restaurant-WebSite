import { Router } from "express";
import {
  createTable,
  deleteTable,
  getAllTables,
  getTableByNumber,
  updateTableReservation,
} from "./table.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const tableRouter = Router();
tableRouter.post("/", 
  // protectedRoutes, allowedTo("admin"),
   createTable);
tableRouter.get("/", getAllTables);
tableRouter.get("/:id", 
  // protectedRoutes, allowedTo("admin"), 
  getTableByNumber);
tableRouter.put(
  "/:tableNumber",
  // protectedRoutes,
  // allowedTo("admin"),
  updateTableReservation
);
tableRouter.delete("/:id", 
  // protectedRoutes, allowedTo("admin"),
   deleteTable);

export default tableRouter;
