import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import Home from "./components/Home";
import About from "./components/About/About";
import CustomerLayout from "./CustomerLayout";
import Menu from "./components/Menu/Menu";
import Login from "./components/Auth/Login";
import BookTable from "./components/Table/BookTable";
import Signup from "./components/Auth/Signup";
import Cart from "./components/cart/Cart";
import ProtectedRoutes from "./components/Auth/ProtectedRoutes";
import { setUser } from "../redux/authSlice"; // Ensure setCart is imported
import MyOrder from "./components/cart/MyOrders";
import OrderDetails from "./components/cart/OrderDetails";
import MenuDetails from "./components/Menu/MenuDetails";
import OrderStatus from "./components/cart/OrderStatus";
import MyReservation from "./components/Reservation/MyReservation";
import { setCart } from "../redux/cartSlice";
import Notifications from "./components/notification/Notifications";

const CustomerDashboard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const getCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(setCart(res.data.cart));
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // Fetch user profile data
  const getUser = async () => {
    if (!accessToken || user) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/user/profile`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      dispatch(setUser(response.data.data));
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  // Fetch cart and user data on component mount or when accessToken changes
  useEffect(() => {
    getCart();
    getUser();
  }, [accessToken]);

  return (
    <Routes>
      <Route path="/" element={<CustomerLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="about" element={<About />} />
        <Route path="menus" element={<Menu />} />
        <Route path="menu/:menuId" element={<MenuDetails />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="booktable" element={<BookTable />} />
          <Route path="cart" element={<Cart />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/order-status/:orderId" element={<OrderStatus />} />
          <Route path="my-orders" element={<MyOrder />} />
          <Route path="my-reservations" element={<MyReservation />} />
          <Route path="order/:orderId" element={<OrderDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default CustomerDashboard;
