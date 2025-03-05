import express from "express";
import {
  markAsRead,
  deleteSingleNotification,
  deleteAllNotification,
  getAllNotifications,
  markAllAsRead,
} from "./notification.controller.js";
import { protectedRoutes } from "../auth/auth.controller.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protectedRoutes, getAllNotifications);
notificationRouter.patch("/:notificationId/read", protectedRoutes, markAsRead);
notificationRouter.put("/readAll", protectedRoutes, markAllAsRead);
notificationRouter.delete("/deleteAll", protectedRoutes, deleteAllNotification);
notificationRouter.delete(
  "/:notificationId",
  protectedRoutes,
  deleteSingleNotification
);

// Delete All Notifications for a User

export default notificationRouter;
