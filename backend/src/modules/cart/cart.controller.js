import { MenuModel } from "../../../Database/models/menu.model.js";
import { CartModel } from "../../../Database/models/cart.model.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import mongoose from "mongoose";

const calculateCartTotals = (cart) => {
  cart.totalPrice = cart.menuItem.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
};

const addMenuItemToCart = asyncHandler(async (req, res, next) => {
  const { menuId, quantity = 1 } = req.body;

  const menuItem = await MenuModel.findById(menuId).select("price");
  if (!menuItem) {
    return next(new AppError("menuItem not found", 404));
  }

  let cart = await CartModel.findOne({ customerId: req.user.id });
  if (!cart) {
    cart = await CartModel.create({
      customerId: req.user.id,
      menuItem: [{ menuId, price: menuItem.price, quantity }],
    });
  } else {
    // Check if product already exists in cart
    const itemIndex = cart.menuItem.findIndex(
      (item) => item.menuId.toString() === menuId
    );

    if (itemIndex > -1) {
      cart.menuItem[itemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.menuItem.push({ menuId, price: menuItem.price, quantity });
    }
  }

  calculateCartTotals(cart);
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, cart, "cart retriverd Successfully"));
});

// Remove product from cart
const removeMenuItemFromCart = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if menu item exists
  const menu = await MenuModel.findById(id);
  if (!menu) {
    return next(new AppError(404, "Menu item not found"));
  }

  // Find the cart
  const cart = await CartModel.findOne({ customerId: req.user._id });
  if (!cart) {
    return next(new AppError(404, "Cart not found"));
  }

  // Find the menu item in the cart
  const itemIndex = cart.menuItem.findIndex(
    (item) => item.menuId.toString() === id
  );

  if (itemIndex === -1) {
    return next(new AppError("Menu item not found in cart", 404));
  }

  // Remove the item from the array
  cart.menuItem.splice(itemIndex, 1);

  // Recalculate cart totals
  calculateCartTotals(cart);
  await cart.save();

  res
    .status(200)
    .json(new ApiResponse(200, cart, "Menu item removed from cart"));
});

const updateMenuItemQuantity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const menu = await MenuModel.findById(id);
  if (!menu) {
    return next(new AppError("MenuItem not found", 404));
  }

  // Find cart and update quantity
  const cart = await CartModel.findOne({ customerId: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const itemIndex = cart.menuItem.findIndex(
    (item) => item.menuId.toString() === id
  );

  if (itemIndex === -1) {
    return next(new AppError("Product not found in cart", 404));
  }

  cart.menuItem[itemIndex].quantity = quantity;

  calculateCartTotals(cart);
  await cart.save();

  res.status(200).json(new ApiResponse(200, "success", cart));
});

const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ customerId: req.user.id });

  if (!cart) {
    return next(new AppError(404, "Cart not found"));
  }

  res.status(200).json({ message: "success", cart });
});

const getPopulatedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ customerId: req.user.id }).populate(
    "menuItem.menuId"
  );

  if (!cart) {
    return next(new AppError(404, "Cart not found"));
  }

  res.status(200).json({ message: "success", cart });
});

export {
  addMenuItemToCart,
  updateMenuItemQuantity,
  removeMenuItemFromCart,
  getLoggedUserCart,
  getPopulatedUserCart,
};
