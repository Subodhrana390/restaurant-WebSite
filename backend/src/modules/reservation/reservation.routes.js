import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getAllReservationByCustomer,
  getAllReservations,
  getReservationById,
  updateReservation,
} from "./reservation.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
const reservationRouter = Router();

reservationRouter.post(
  "/",
  protectedRoutes,
  allowedTo("customer"),
  createReservation
);
reservationRouter.get(
  "/customer",
  protectedRoutes,
  allowedTo("customer"),
  getAllReservationByCustomer
);
reservationRouter.get(
  "/",
  protectedRoutes,
  allowedTo("admin"),
  getAllReservations
);
reservationRouter.get(
  "/:id",
  protectedRoutes,
  allowedTo(["customer", "admin"]),
  getReservationById
);
reservationRouter.put(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  updateReservation
);
reservationRouter.delete(
  "/:id",
  protectedRoutes,
  allowedTo("admin"),
  deleteReservation
);

export default reservationRouter;
