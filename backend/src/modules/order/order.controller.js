import { OrderModel } from "../../../Database/models/order.model.js";
import crypto from "crypto";
import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { razorpayInstance } from "../../../config/razorpay.js"; // Ensure this exists and is configured
import { MenuModel } from "../../../Database/models/menu.model.js";
import { CartModel } from "../../../Database/models/cart.model.js";
import { createNotification } from "../notification/notification.controller.js";
import axios from "axios";

const createCashOrder = asyncHandler(async (req, res) => {
  const cart = await CartModel.findById(req.params.id);
  if (!cart) throw new AppError("Cart not found", 404);

  const { address, phone, city } = req.body.shippingAddress;

  // Create Order
  const [order] = await OrderModel.insertMany([
    {
      userId: req.user._id,
      menuItems: cart.menuItem,
      totalPrice,
      shippingAddress: { address, city, phone },
      paidAt: null,
      deliveredAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: "pending",
    },
  ]);

  if (!order) throw new AppError("Failed to create order", 500);

  // Update Product Stock
  const stockUpdates = cart.menuItem.map((item) => ({
    updateOne: {
      filter: { _id: item.menuId },
      update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
    },
  }));

  const [stockUpdateResult] = await Promise.all([
    MenuModel.bulkWrite(stockUpdates),
    CartModel.findByIdAndDelete(req.params.id),
  ]);

  if (!stockUpdateResult.ok) throw new AppError("Failed to update stock", 500);

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Order created successfully", { order: newOrder })
    );
});

const getSpecificOrderByCustomer = asyncHandler(async (req, res, next) => {
  try {
    console.log(req.user._id);
    const orders = await OrderModel.find({ customer: req.user._id })
      .populate("menuItems.menuId")
      .populate("customer");

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this customer" });
    }

    res.status(200).json({ message: "Success", orders });
  } catch (error) {
    next(error); // Pass the error to the error handler
  }
});

const getSpecificOrderById = asyncHandler(async (req, res) => {
  let order = await OrderModel.findOne({
    customer: req.user._id,
    _id: req.params.id,
  })
    .populate("menuItems.menuId")
    .populate("customer");

  res.status(200).json({ message: "success", order });
});

// 📌 Create a new order
const createOrder = asyncHandler(async (req, res, next) => {
  const {
    menuItem,
    paymentMethod = "online",
    deliveryType,
    address,
    specialInstructions,
    tableNumber,
    totalPrice,
  } = req.body;

  const newOrder = new OrderModel({
    customer: req.user._id,
    menuItems: menuItem,
    totalPrice,
    paymentMethod,
    paymentStatus: paymentMethod === "online" ? "pending" : "paid",
    deliveryType,
    address: deliveryType === "delivery" ? address : null,
    specialInstructions,
    tableNumber: deliveryType === "dine-in" ? tableNumber : null,
  });

  const savedOrder = await newOrder.save();

  if (paymentMethod === "online") {
    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: savedOrder._id.toString(),
    };
    const razorpayOrder = await razorpayInstance.orders.create(options);

    const newNotification = await createNotification({
      recipientId: order.customer,
      type: "orders",
      content: order.status,
      orderId: order._id,
    });

    await axios.post(`${WEBSOCKET_BASE_URL}/sendOrderUpdate`, {
      userId: order.customer,
      data: newNotification,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { razorpayOrder, savedOrder },
          "Order created successfully"
        )
      );
  }

  res
    .status(201)
    .json(new ApiResponse(201, savedOrder, "Order created successfully"));
});

const verifyPayment = asyncHandler(async (req, res, next) => {
  const { orderId, razorpay_order_id, paymentId, signature } = req.body;

  const order = await OrderModel.findById(orderId);
  if (!order) return next(new AppError(404, "Order not found"));

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${paymentId}`)
    .digest("hex");

  if (generatedSignature !== signature) {
    return next(new AppError(400, "Invalid payment signature"));
  }

  const cart = await CartModel.findOne({ customerId: order.customer });
  if (cart) {
    cart.menuItem = [];
    await cart.save();
  }

  order.paymentStatus = "paid";
  order.paymentId = paymentId;
  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, order, "Payment verified successfully"));
});

// 📌 Get all orders (Filter by status, paymentMethod, deliveryType)
const getAllOrders = asyncHandler(async (req, res, next) => {
  const { cursor, limit = 10, status, paymentMethod, deliveryType } = req.query;
  const pageSize = parseInt(limit, 10) || 10;

  let query = {};
  if (status) query.status = status;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (deliveryType) query.deliveryType = deliveryType;

  if (cursor) {
    query._id = { $lt: cursor };
  }

  const orders = await OrderModel.find(query)
    .sort({ _id: -1 })
    .limit(pageSize)
    .populate("menuItems.menuId")
    .populate("customer");

  if (!orders.length) {
    return next(new AppError(404, "No orders found"));
  }

  const nextCursor =
    orders.length === pageSize ? orders[orders.length - 1]._id : null;

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { orders, nextCursor },
        "Orders fetched successfully"
      )
    );
});

// 📌 Update order status (For staff/admin)
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  // Find the order
  const order = await OrderModel.findById(orderId);
  if (!order) throw new AppError(404, "Order not found");

  // Update order status
  order.status = status;
  await order.save();

  const newNotification = await createNotification({
    recipientId: order.customer,
    type: "orders",
    content: status,
    orderId: order._id,
  });

  await axios.post(`${WEBSOCKET_BASE_URL}/sendOrderUpdate`, {
    userId: order.customer,
    data: newNotification,
  });
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { orderId, paymentStatus, paymentId } = req.body;
  const order = await OrderModel.findByIdAndUpdate(
    orderId,
    { paymentStatus, paymentId },
    { new: true }
  );
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// 📌 Cancel an order (Refund if applicable)
const cancelOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findById(orderId);
  if (!order) throw new AppError(404, "Order not found");

  if (order.paymentStatus === "paid" && order.paymentMethod === "online") {
    await razorpayInstance.payments.refund(order.paymentId);
    order.paymentStatus = "refunded";
  }

  order.status = "cancelled";
  await order.save();

  const newNotification = await createNotification({
    recipientId: order.customer,
    type: "orders",
    content: order.status,
    orderId: order._id,
  });

  await axios.post(`${WEBSOCKET_BASE_URL}/sendOrderUpdate`, {
    userId: order.customer,
    data: newNotification,
  });

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

// 📌 Delete order (Admin only)
const deleteOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await OrderModel.findByIdAndDelete(orderId);
  if (!order) throw new AppError(404, "Order not found");

  res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

export {
  createCashOrder,
  createOrder,
  getSpecificOrderByCustomer,
  getSpecificOrderById,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  verifyPayment,
  updatePaymentStatus,
  getAllOrders,
};
