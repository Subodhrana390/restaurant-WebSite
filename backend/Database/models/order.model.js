import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menuItems: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending","preparing", "ready", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentId: { type: String, default: null },
    deliveryType: {
      type: String,
      enum: ["dine-in", "delivery"],
      required: true,
    },
    tableNumber: { type: Number, default: null },
    assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    specialInstructions: { type: String, default: "" },
    orderTime: { type: Date, default: Date.now },
    estimatedDeliveryTime: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model("Order", orderSchema);
