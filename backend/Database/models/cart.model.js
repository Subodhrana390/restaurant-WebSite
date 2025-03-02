import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    customerId: {
      type: Schema.ObjectId,
      ref: "User",
    },
    menuItem: [
      {
        menuId: { type: Schema.ObjectId, ref: "Menu" },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);

export const CartModel = model("Cart", cartSchema);
