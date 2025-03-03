import React, { useEffect, useState } from "react";
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import LogoBrew from "../../../assets/Logo_brew.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/authSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { menuItem } = useSelector((state) => state.cart);
  const { accessToken, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Scroll Event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Toggle login dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action
    navigate("/login"); // Redirect to login page
    setIsDropdownOpen(false); // Close dropdown
  };

  return (
    <div
      className={`header w-full h-20 transition-all duration-300 flex items-center ${
        isScrolled
          ? "bg-white shadow-md fixed top-0 left-0 z-50 "
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-20 flex justify-between items-center w-full">
        {/* Logo */}
        <div className="logo flex items-center gap-4">
          <img
            src={LogoBrew}
            alt="The Brew Master Logo"
            className="w-20 h-20 object-contain mix-blend-multiply cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Navigation Links (Desktop) */}
        <ul className="hidden md:flex items-center gap-6 font-semibold">
          {["Home", "About", "Menus", "Chefs", "Contact"].map((item) => (
            <li
              key={item}
              className="text-gray-700 hover:text-orange-500 transition"
            >
              <a href={`/${item === "Home" ? "/" : item.toLowerCase()}`}>
                {item}
              </a>
            </li>
          ))}
          {/* Add My Orders and My Reservations if user is logged in */}
          {accessToken && (
            <>
              <li className="text-gray-700 hover:text-orange-500 transition">
                <a href="/my-orders">My Orders</a>
              </li>
              <li className="text-gray-700 hover:text-orange-500 transition">
                <a href="/my-reservations">My Reservations</a>
              </li>
            </>
          )}
        </ul>

        {/* Right Side Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Login Dropdown or Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition"
              onClick={toggleDropdown}
            >
              <FaUser size={20} />
              <span>{accessToken ? user?.name : "Account"}</span>
              <MdKeyboardArrowDown size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2">
                {accessToken ? (
                  <>
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className="block px-4 py-2 hover:bg-gray-100"
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
            className="text-gray-700 hover:text-orange-500 transition flex items-center gap-2"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart size={20} />
            <span>Cart ({menuItem ? menuItem.length : 0})</span>
          </button>

          {/* Book a Table */}
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition shadow-lg"
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
                className="text-gray-700 hover:text-orange-500 transition"
              >
                <a href={`${item.toLowerCase()}`} onClick={toggleMenu}>
                  {item}
                </a>
              </li>
            ))}
            {/* Add My Orders and My Reservations if user is logged in */}
            {accessToken && (
              <>
                <li className="text-gray-700 hover:text-orange-500 transition">
                  <a href="/my-orders" onClick={toggleMenu}>
                    My Orders
                  </a>
                </li>
                <li className="text-gray-700 hover:text-orange-500 transition">
                  <a href="/my-reservations" onClick={toggleMenu}>
                    My Reservations
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Additional Buttons (Mobile) */}
          <div className="mt-6 space-y-4">
            {accessToken ? (
              <>
                <a
                  href="/profile"
                  className="block text-gray-700 hover:text-orange-500 transition"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-700 hover:text-orange-500 transition flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="block text-gray-700 hover:text-orange-500 transition"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block text-gray-700 hover:text-orange-500 transition"
                >
                  Signup
                </a>
              </>
            )}
            <button
              className="w-full text-gray-700 hover:text-orange-500 transition flex items-center gap-2"
              onClick={() => navigate("/cart")}
            >
              <FaShoppingCart size={20} />
              Cart ({menuItem ? menuItem.length : 0})
            </button>
            <button className="w-full bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition shadow-lg">
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
