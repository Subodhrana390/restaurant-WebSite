import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, setCart } from "../../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const categories = [
  "All",
  "Starter",
  "Main Course",
  "Dessert",
  "Beverage",
  "Side Dish",
];

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-6 py-2 rounded-full transition duration-300 ${
            selectedCategory === category
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const MenuItem = ({ item, addToCart, removeFromCart }) => {
  const { menuItem } = useSelector((state) => state.cart);
  const isInCart = menuItem?.some((m) => String(m.menuId) === String(item._id));
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <img
        src={`${import.meta.env.VITE_IMAGE_BASE_URL}/menu/${item.image}`}
        alt={item.name}
        className="w-full h-60 object-cover"
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <p className="text-lg font-bold text-orange-500">₹ {item.price}</p>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => (isInCart ? removeFromCart(item) : addToCart(item))}
            className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-orange-600"
          >
            <FaShoppingCart className="mr-2" />
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

const FoodMenu = () => {
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { accessToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/menu`,
          {
            params: {
              limit: 5,
              category:
                selectedCategory === "All"
                  ? null
                  : selectedCategory.toLowerCase(),
            },
          }
        );
        setMenus(res.data.data.menuItems);
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch menu items. Please try again later.");
      }
    };
    fetchMenus();
  }, [selectedCategory]);

  const handleLoginRedirect = () => {
    toast.error("You need to log in first.");
    navigate("/login");
  };

  const addToCart = async (item) => {
    if (!accessToken) {
      handleLoginRedirect();
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/cart`,
        { menuId: item._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      dispatch(setCart(res.data.data));
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item to cart.");
    }
  };

  const removeItemFromCart = async (item) => {
    if (!accessToken) {
      handleLoginRedirect();
      return;
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/cart/${item._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      dispatch(removeFromCart(item._id));
      toast.success(`${item.name} removed from cart!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item from cart.");
    }
  };

  return (
    <div className="py-16 px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 px-6 md:px-20">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Popular Menu
          </h1>
          <p className="text-lg text-gray-600">Delicious Food Menu Special</p>
        </div>
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {menus.length === 0 ? (
          <p className="text-center text-gray-600">No menu items available.</p>
        ) : (
          menus.map((item) => (
            <MenuItem
              key={item._id}
              item={item}
              addToCart={accessToken ? addToCart : handleLoginRedirect}
              removeFromCart={
                accessToken ? removeItemFromCart : handleLoginRedirect
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FoodMenu;
