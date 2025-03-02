import express from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addMenuItemToCart,
  getLoggedUserCart,
  getPopulatedUserCart,
  removeMenuItemFromCart,
  updateMenuItemQuantity,
} from "../cart/cart.controller.js";
const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("customer"), addMenuItemToCart)
  .get(protectedRoutes, allowedTo("customer"), getLoggedUserCart);

cartRouter
  .route("/populated")
  .get(protectedRoutes, allowedTo("customer"), getPopulatedUserCart);

cartRouter
  .route("/:id")
  .delete(protectedRoutes, allowedTo("customer"), removeMenuItemFromCart)
  .put(protectedRoutes, allowedTo("customer"), updateMenuItemQuantity);

export default cartRouter;
