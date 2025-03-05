import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaBell,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import { MdClear, MdKeyboardArrowDown } from "react-icons/md";
import LogoBrew from "../../../assets/Logo_brew.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/authSlice";
import { io } from "socket.io-client";
import axios from "axios";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const { menuItem } = useSelector((state) => state.cart);
  const { accessToken, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let socket = io(import.meta.env.VITE_WEBSOCKET_BASE_URL, {
      transports: ["websocket"],
      query: { userId: user._id },
    });

    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
    });

    socket.on("orderUpdate", (data) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: data._id,
          type: data.type,
          message: `Your order: ${data.orderId} is ${data.content}`,
          time: new Date(data.timestamp).toLocaleString(),
          isRead: false,
        },
      ]);
    });

    fetchNotifications();

    return () => socket.disconnect();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 150);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/notification`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (Array.isArray(response.data.data)) {
        setNotifications(
          response.data.data.map((notif) => ({
            id: notif._id,
            type: notif.type,
            message: `Your order ${notif.orderId} is ${notif.content}`,
            time: new Date(notif.timestamp).toLocaleString(),
            isRead: notif.isRead,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleNotifications = () => setIsNotificationsOpen((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsDropdownOpen(false);
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_APP_BASE_URL
        }/notification/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
    setIsNotificationsOpen(false);
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/notification/readAll`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/notification/deleteAll`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/notification/${notificationId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setNotifications((prev) =>
        prev.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div
      className={`header w-full h-20 transition-all duration-300 flex items-center ${
        isScrolled
          ? "bg-white shadow-md fixed top-0 left-0 z-50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 flex justify-between items-center w-full">
        {/* Logo */}
        <div className="logo flex items-center gap-4">
          <img
            src={LogoBrew}
            alt="The Brew Master Logo"
            className="w-20 h-20 object-contain mix-blend-multiply cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Navigation Links (Desktop) */}
        <ul className="hidden md:flex items-center gap-8 font-semibold">
          {["Home", "About", "Menus", "Chefs", "Contact"].map((item) => (
            <li
              key={item}
              className="text-gray-700 hover:text-orange-500 transition duration-300"
            >
              <a href={`/${item === "Home" ? "" : item.toLowerCase()}`}>
                {item}
              </a>
            </li>
          ))}
          {isAuthenticated && (
            <>
              <li className="text-gray-700 hover:text-orange-500 transition duration-300">
                <a href="/my-orders">My Orders</a>
              </li>
              <li className="text-gray-700 hover:text-orange-500 transition duration-300">
                <a href="/my-reservations">My Reservations</a>
              </li>
            </>
          )}
        </ul>

        {/* Right Side Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {/* Notifications */}
          <div className="relative">
            <button
              className="text-gray-700 hover:text-orange-500 transition duration-300 flex items-center"
              onClick={toggleNotifications}
            >
              <FaBell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter((not) => !not.isRead).length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden z-50">
                {/* Notifications Header */}
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Notifications
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-gray-600 hover:text-green-600 transition duration-300 flex items-center gap-1"
                      title="Mark all as read"
                    >
                      <FaCheckCircle size={16} />
                    </button>
                    <button
                      onClick={clearAllNotifications}
                      className="text-gray-600 hover:text-red-600 transition duration-300 flex items-center gap-1"
                      title="Clear all notifications"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b last:border-b-0 flex justify-between items-center hover:bg-gray-50 transition duration-300 ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                          className="flex-grow cursor-pointer"
                        >
                          <div className="font-medium text-gray-800">
                            {notification.message}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="ml-2 text-gray-400 hover:text-red-600 transition duration-300"
                          title="Delete notification"
                        >
                          <MdClear size={20} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition duration-300"
              onClick={toggleDropdown}
            >
              <FaUser size={20} />
              <span>{accessToken ? user?.name : "Account"}</span>
              <MdKeyboardArrowDown size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition duration-300"
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition duration-300 flex items-center gap-2"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100 transition duration-300"
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-2 hover:bg-gray-100 transition duration-300"
                    >
                      Signup
                    </a>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            className="text-gray-700 hover:text-orange-500 transition duration-300 flex items-center gap-2"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart size={20} />
            <span>Cart ({menuItem ? menuItem.length : 0})</span>
          </button>

          {/* Book a Table */}
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300 shadow-lg"
            onClick={() => navigate("/bookTable")}
          >
            Book a Table
          </button>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button className="md:hidden text-gray-700" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button className="text-gray-700 mb-6" onClick={toggleMenu}>
            <FaTimes size={24} />
          </button>

          {/* Mobile Navigation Links */}
          <ul className="space-y-4 text-lg font-semibold">
            {["Home", "About", "Menus", "Chefs", "Contact"].map((item) => (
              <li
                key={item}
                className="text-gray-700 hover:text-orange-500 transition duration-300"
              >
                <a href={`/${item === "Home" ? "" : item.toLowerCase()}`}>
                  {item}
                </a>
              </li>
            ))}
            {isAuthenticated && (
              <>
                <li className="text-gray-700 hover:text-orange-500 transition duration-300">
                  <a href="/my-orders" onClick={toggleMenu}>
                    My Orders
                  </a>
                </li>
                <li className="text-gray-700 hover:text-orange-500 transition duration-300">
                  <a href="/my-reservations" onClick={toggleMenu}>
                    My Reservations
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Additional Buttons (Mobile) */}
          <div className="mt-6 space-y-4">
            {isAuthenticated ? (
              <>
                <a
                  href="/profile"
                  className="block text-gray-700 hover:text-orange-500 transition duration-300"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-700 hover:text-orange-500 transition duration-300 flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="block text-gray-700 hover:text-orange-500 transition duration-300"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block text-gray-700 hover:text-orange-500 transition duration-300"
                >
                  Signup
                </a>
              </>
            )}
            <button
              className="w-full text-gray-700 hover:text-orange-500 transition duration-300 flex items-center gap-2"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart size={20} />
              Cart ({menuItem ? menuItem.length : 0})
            </button>
            <button className="w-full bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition duration-300 shadow-lg">
              Book a Table
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default Header;
