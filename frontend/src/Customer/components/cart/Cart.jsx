import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaTrash,
  FaClock,
  FaArrowRight,
  FaPlusCircle,
  FaMinusCircle,
  FaUtensils,
  FaCoffee,
  FaCreditCard,
} from "react-icons/fa";
import { LuChefHat } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../../../redux/cartSlice";
import { toast } from "react-toastify";
import Razorpay from "razorpay";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { accessToken } = useSelector((state) => state.auth);
  const { menuItem } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [deliveryType, setDeliveryType] = useState("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const getCart = async () => {
    if (!accessToken) {
      handleLoginRedirect();
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/cart/populated`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data && res.data.cart && Array.isArray(res.data.cart.menuItem)) {
        setCartItems(res.data.cart.menuItem);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items.");
    }
  };

  useEffect(() => {
    getCart();
  }, []);

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

      setCartItems((prev) =>
        prev.map((item) =>
          item.menuId._id === id ? { ...item, quantity } : item
        )
      );

      toast.success(`Item quantity updated`);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const increaseQuantity = (item) => {
    handleQuantityCart({ id: item.menuId._id, quantity: item.quantity + 1 });
  };

  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      handleQuantityCart({
        id: item.menuId._id,
        quantity: item.quantity - 1,
      });
    } else {
      removeItemFromCart(item.menuId._id);
    }
  };

  const removeItemFromCart = async (id) => {
    if (!accessToken) {
      handleLoginRedirect();
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_APP_BASE_URL}/cart/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch(removeFromCart(id));

      setCartItems((prev) => {
        return prev.filter((cartItem) => cartItem.menuId?._id !== id);
      });
      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart.");
    }
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const isAddressValid = (address) => {
    return (
      address &&
      address.street.trim() !== "" &&
      address.city.trim() !== "" &&
      address.state.trim() !== "" &&
      address.zipCode.trim() !== "" &&
      address.country.trim() !== ""
    );
  };

  // Get current category icons
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Main Course":
        return <LuChefHat size={14} />;
      case "Dessert":
        return <FaCoffee size={14} />;
      case "Beverages":
        return <FaCoffee size={14} />;
      default:
        return <FaUtensils size={14} />;
    }
  };
  const createOrder = async () => {
    if (deliveryType === "dine-in" && !tableNumber) {
      toast.error("Table number is required for dine-in orders.");
      return;
    }

    if (deliveryType === "delivery" && !isAddressValid(address)) {
      toast.error("Complete delivery address is required.");
      return;
    }

    let orderData = {
      menuItem,
      totalPrice,
      deliveryType,
      address,
      specialInstructions,
      tableNumber,
      paymentMethod: "online",
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/orders/create-online`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { savedOrder, razorpayOrder } = response.data.data;

      if (orderData.paymentMethod === "online" && razorpayOrder) {
        if (typeof Razorpay === "undefined") {
          console.error("Razorpay SDK not loaded.");
          return;
        }

        const customer = {
          name: orderData.customer?.name || "Guest",
          email: orderData.customer?.email || "guest@example.com",
          phone: orderData.customer?.phone || "0000000000",
        };

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Brew Master",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                `${import.meta.env.VITE_APP_BASE_URL}/orders/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  orderId: savedOrder._id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }
              );

<<<<<<< HEAD
              if (verifyRes.data.success) {
                await updatePaymentStatus(
                  savedOrder._id,
                  "paid",
                  response.razorpay_payment_id
                );
=======
              if (verifyRes.data.success){
>>>>>>> 3d3e41ddd1b8fb0caff12c5b524fb898eec22da9
                navigate(`/order-status/${savedOrder._id}`);
              } else {
                console.error("Payment verification failed:", verifyRes.data);
                await updatePaymentStatus(
                  savedOrder._id,
                  "failed",
                  response.razorpay_payment_id
                );
              }
            } catch (err) {
              console.error(
                "Payment verification error:",
                err.response?.data || err.message
              );
              await updatePaymentStatus(
                savedOrder._id,
                "failed",
                response.razorpay_payment_id
              );
            }
          },
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone,
          },
          theme: {
            color: "#3399cc",
          },
          modal: {
            onDismiss: async function () {
              console.warn("Payment popup closed by user.");
              await updatePaymentStatus(savedOrder._id, "failed", null);
            },
          },
        };

        // **Properly create a new Razorpay instance**
        const rzp = new window.Razorpay(options);
        rzp.open();

        rzp.on("payment.failed", async function (response) {
          console.error("Payment failed:", response.error);
          await updatePaymentStatus(
            savedOrder._id,
            "failed",
            response.error.metadata.payment_id || null
          );
        });
      } else {
        navigate(`/order-status/${savedOrder._id}`);
      }
    } catch (error) {
      console.error(
        "Error creating order:",
        error.response?.data || error.message || "Something went wrong"
      );
    }
  };

  const updatePaymentStatus = async (orderId, status, paymentId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/orders/updatePaymentStatus`,
        { orderId, paymentStatus: status, paymentId: paymentId || null },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (status === "failed") {
        navigate(`/order-status/${orderId}`);
      }
    } catch (error) {
      console.error(
        "Error updating payment status:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                <FaShoppingBag size={24} />
                Your Order
                <span className="bg-white text-orange-600 text-sm rounded-full px-2 py-1 ml-2">
                  {cartItems.length} items
                </span>
              </h1>
              {/* {cartItems.length > 0 && (
                <div className="hidden md:flex items-center gap-2 bg-white bg-opacity-20 text-white px-3 py-2 rounded-lg">
                  <FaClock size={16} />
                  <span className="text-sm">
                    Est. delivery: {estimatedTime} min
                  </span>
                </div>
              )} */}
            </div>
          </div>

          {/* Cart Content */}
          <div className="p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <FaShoppingBag size={64} className="text-gray-300" />
                <p className="text-xl text-gray-500">Your cart is empty</p>
                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  Back to Menu
                </button>
              </div>
            ) : (
              <div>
                {/* Cart Items */}
                {cartItems.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Your Selection
                    </h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-amber-50 transition duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={`${
                                import.meta.env.VITE_IMAGE_BASE_URL
                              }/menu/${item.menuId.image}`}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {item.menuId.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                  {getCategoryIcon(item.menuId.category)}
                                  {item.menuId.category}
                                </span>
                                <span className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  <FaClock size={14} />
                                  {item.preparationTime}
                                </span>
                              </div>
                              <p className="text-orange-600 font-medium mt-1">
                                ₹ {item.price}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-4 sm:mt-0">
                            <div className="flex items-center bg-gray-100 rounded-lg">
                              <button
                                onClick={() => decreaseQuantity(item)}
                                className="p-2 hover:text-orange-600 transition"
                                aria-label="Decrease quantity"
                              >
                                <FaMinusCircle size={18} />
                              </button>
                              <span className="px-3 font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => increaseQuantity(item)}
                                className="p-2 hover:text-orange-600 transition"
                                aria-label="Increase quantity"
                              >
                                <FaPlusCircle size={18} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                // onClick={() => saveForLater(item._id)}
                                className="p-2 text-gray-500 hover:text-orange-600 transition"
                                aria-label="Save for later"
                              >
                                <FaClock size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  removeItemFromCart(item.menuId._id)
                                }
                                className="p-2 text-gray-500 hover:text-red-600 transition"
                                aria-label="Remove item"
                              >
                                <FaTrash size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                {cartItems.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      🛍️ Order Summary
                    </h2>
                    <div className="mb-4">
                      <label className="text-gray-600 block mb-2">
                        Delivery Type
                      </label>
                      <select
                        className="w-full p-2 border rounded-lg"
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value)}
                      >
                        <option value="dine-in">Dine-In</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>

                    {deliveryType === "dine-in" && (
                      <div className="mb-4">
                        <label className="text-gray-600 block mb-2">
                          Table Number
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-lg"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                        />
                      </div>
                    )}

                    {deliveryType === "delivery" && (
                      <div className="mb-4">
                        <label className="text-gray-600 block mb-2">
                          Delivery Address
                        </label>
                        <input
                          type="text"
                          name="street"
                          placeholder="Street"
                          className="w-full p-2 border rounded-lg mb-2"
                          value={address.street}
                          onChange={handleAddressChange}
                        />
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          className="w-full p-2 border rounded-lg mb-2"
                          value={address.city}
                          onChange={handleAddressChange}
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          className="w-full p-2 border rounded-lg mb-2"
                          value={address.state}
                          onChange={handleAddressChange}
                        />
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="Zip Code"
                          className="w-full p-2 border rounded-lg mb-2"
                          value={address.zipCode}
                          onChange={handleAddressChange}
                        />
                      </div>
                    )}
                    <div className="mb-4">
                      <label className="text-gray-600 block mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        className="w-full p-2 border rounded-lg"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Any special requests?"
                      />
                    </div>

                    {/* Subtotal */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        ₹ {totalPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Delivery Fee */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">₹ 40.00</span>
                    </div>

                    {/* Platform Service Fee */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">
                        Platform Service Fee
                      </span>
                      <span className="font-medium">
                        ₹ {(totalPrice * 0.05).toFixed(2)}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-orange-600">
                        ₹ {(totalPrice + 40 + totalPrice * 0.05).toFixed(2)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    <button
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                      onClick={createOrder}
                    >
                      <FaCreditCard size={18} />
                      <span>Place Order</span>
                      <FaArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
