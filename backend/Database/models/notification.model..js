import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: ["orders"],
      default: "orders",
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = model("Notification", notificationSchema);
