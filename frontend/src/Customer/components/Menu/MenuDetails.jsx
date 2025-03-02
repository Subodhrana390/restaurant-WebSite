import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaFire,
  FaLeaf,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShoppingCart,
  FaSpinner,
} from "react-icons/fa";
import { MdFoodBank, MdLocalOffer } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  removeFromCart,
  setCart,
  updateQuantity,
} from "../../../redux/cartSlice";

const MenuDetails = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { menuItem } = useSelector((state) => state.cart);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isInCart = menuItem?.some(
    (m) => String(m?.menuId) === String(item?._id)
  );
  const foundItem = menuItem.find((menu) => menu.menuId === item?._id);
  const itemQuantity = foundItem ? foundItem.quantity : 0;

  // Fetch cart data
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
      toast.error("Failed to fetch cart data.");
    }
  };

  // Fetch menu item details
  const fetchMenu = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/menu/${menuId}`
      );
      setItem(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch menu item. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
    if (accessToken) {
      getCart();
    }
  }, [menuId, accessToken]);

  // Handle login redirect
  const handleLoginRedirect = () => {
    toast.error("You need to log in first.");
    navigate("/login");
  };

  // Update item quantity in cart
  const handleQuantityCart = async ({ id, quantity }) => {
    if (!accessToken) {
      handleLoginRedirect();
      return;
    }

    if (quantity < 1) {
      toast.warning("Minimum quantity is 1.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/cart/${id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      dispatch(updateQuantity({ id, quantity }));
      toast.success(`Item quantity updated`);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Increase item quantity
  const increaseQuantity = (item) => {
    const foundItem = menuItem.find((menu) => menu.menuId === item?._id);
    if (foundItem) {
      handleQuantityCart({ id: item._id, quantity: foundItem.quantity + 1 });
    }
  };

  // Decrease item quantity
  const decreaseQuantity = (item) => {
    const foundItem = menuItem.find((menu) => menu.menuId === item?._id);
    if (foundItem) {
      if (foundItem.quantity > 1) {
        handleQuantityCart({ id: item._id, quantity: foundItem.quantity - 1 });
      } else {
        removeItemFromCart(item);
      }
    }
  };

  // Add item to cart
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

  // Remove item from cart
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

  // Format price
  const formatPrice = (price) => {
    return `₹ ${price.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Menu item not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="shadow-sm py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold ml-4">Menu Details</h1>
        </div>
      </div>

      {/* Menu details */}
      <div className="max-w-6xl mx-auto pt-4 pb-24 px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden md:flex md:flex-row mt-4">
          {/* Image Section */}
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <img
              src={`${import.meta.env.VITE_IMAGE_BASE_URL}/menu/${item.image}`}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/images/placeholder-food.jpg"; // Fallback image
              }}
            />
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </div>
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full shadow-md ${
                item.isVeg ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {item.isVeg ? <FaLeaf /> : "Non-Veg"}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 md:w-1/2">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
              <div className="flex items-center">
                <FaFire
                  className={`mr-1 ${
                    item.spiceLevel === "high"
                      ? "text-red-500"
                      : item.spiceLevel === "medium"
                      ? "text-orange-400"
                      : "text-yellow-400"
                  }`}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {item.spiceLevel} Spicy
                </span>
              </div>
            </div>

            <p className="text-gray-600 mt-2">{item.description}</p>

            <div className="mt-4">
              <div className="flex items-center">
                <MdFoodBank className="text-gray-500 mr-2" />
                <h3 className="font-medium text-gray-700">Ingredients:</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.ingredients.map((ingredient, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {item.discount > 0 && (
              <div className="mt-4 flex items-center">
                <MdLocalOffer className="text-green-500 mr-2" />
                <span className="text-green-500 font-medium">
                  {item.discount}% OFF
                </span>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => decreaseQuantity(item)}
                  className="px-4 py-2 border-r hover:bg-gray-100"
                  aria-label="Decrease quantity"
                >
                  <FaMinus className="text-gray-500" />
                </button>
                <span className="px-4 py-2">{itemQuantity}</span>
                <button
                  onClick={() => increaseQuantity(item)}
                  className="px-4 py-2 border-l hover:bg-gray-100"
                  aria-label="Increase quantity"
                >
                  <FaPlus className="text-gray-500" />
                </button>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Price</p>
                <p className="text-xl font-bold">
                  {formatPrice(item.finalPrice)}
                </p>
              </div>
            </div>

            <div className="float-right mt-5">
              <button
                onClick={() =>
                  isInCart ? removeItemFromCart(item) : addToCart(item)
                }
                className="flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-orange-600"
              >
                <FaShoppingCart className="mr-2" />
                {isInCart ? "Remove from Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuDetails;
