import express from "express";
import {
  cancelOrder,
  createCashOrder,
  createOrder,
  deleteOrder,
  getAllOrders,
  getSpecificOrderByCustomer,
  getSpecificOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  verifyPayment,
} from "./order.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const router = express.Router();

router.post("/cash-order", createCashOrder);
router.post(
  "/create-online",
  protectedRoutes,
  allowedTo("customer"),
  createOrder
);
router.post("/verify-payment", verifyPayment);
router.get("/", protectedRoutes, allowedTo("admin"), getAllOrders);
router.get("/customer",protectedRoutes, allowedTo("customer"), getSpecificOrderByCustomer);
router.get(
  "/:id",
  protectedRoutes,
  allowedTo("customer"),
  getSpecificOrderById
);
router.put(
  "/:orderId/status",
  protectedRoutes,
  allowedTo("admin"),
  updateOrderStatus
); // Update order status
router.put(
  "/updatePaymentStatus",
  protectedRoutes,
  allowedTo("customer"),
  updatePaymentStatus
); // Update order status
router.put("/:orderId/cancel", protectedRoutes, cancelOrder);
router.delete("/:orderId", protectedRoutes, allowedTo("admin"), deleteOrder);

export default router;
