import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClipboardCheck,
  FaCreditCard,
  FaMoneyBill,
  FaUserAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUtensils,
  FaInfoCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaTable,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { MdMoney, MdOutlineDangerous } from "react-icons/md";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId, accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          <FaArrowLeft /> Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Order not found</p>
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          <FaArrowLeft /> Back to Orders
        </button>
      </div>
    );
  }

  // Format date for better readability
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format address based on whether it's a string or object
  const formatAddress = (address) => {
    if (!address) return "No address provided";

    if (typeof address === "string") return address;

    // If address is an object with structured fields
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean);

    return parts.join(", ");
  };

  // Get full address details for displaying in components
  const getAddressDetails = (address) => {
    if (!address) return null;

    // If address is just a string
    if (typeof address === "string") {
      return { fullAddress: address };
    }

    // If address is an object with structured fields
    return {
      street: address.street || "",
      city: address.city || "",
      state: address.state || "",
      zipCode: address.zipCode || "",
      country: address.country || "",
      fullAddress: formatAddress(address),
    };
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ready":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get payment status badge color
  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get address details if available
  const addressDetails = getAddressDetails(order.address);

  const cancelOrder = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/orders/${orderId}/cancel`,
        {}, // Empty object as the request body (if no data is needed)
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchOrderDetails();
    } catch (error) {
      console.error("Error canceling order:", error);
      setError("Failed to cancel the order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Order Header */}
        <div className="bg-gray-50 p-4 border-b flex flex-col md:flex-row justify-between">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>
            <p className="font-medium">{order._id}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-sm text-gray-500">Order Date</p>
            <p className="flex items-center gap-1 font-medium">
              <FaCalendarAlt className="text-gray-500" />
              {formatDate(order.orderTime)}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border ${getStatusColor(
                order.status
              )}`}
            >
              {order.status === "pending" ? (
                <FaHourglassHalf className="mr-1" />
              ) : (
                <FaCheckCircle className="mr-1" />
              )}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaUserAlt /> Customer Information
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-medium w-20">Name:</span>
                <span>{order.customer.name}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                <span>{order.customer.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-gray-500" />
                <span>{order.customer.phone}</span>
              </p>
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaClipboardCheck /> Order Information
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-medium w-32">Delivery Type:</span>
                <span className="flex items-center gap-1">
                  <FaUtensils className="text-gray-500" />
                  {order.deliveryType.charAt(0).toUpperCase() +
                    order.deliveryType.slice(1)}
                </span>
              </p>
              {order.deliveryType === "dine-in" && (
                <p className="flex items-center gap-2">
                  <span className="font-medium w-32">Table Number:</span>
                  <span className="flex items-center gap-1">
                    <FaTable className="text-gray-500" />
                    {order.tableNumber}
                  </span>
                </p>
              )}
              {addressDetails && (
                <div className="flex items-start gap-2">
                  <span className="font-medium w-32">Delivery Address:</span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span className="font-medium">Delivery Location</span>
                    </div>
                    {typeof order.address === "string" ? (
                      <p>{order.address}</p>
                    ) : (
                      <>
                        {order.address.street && <p>{order.address.street}</p>}
                        <p>
                          {[
                            order.address.city,
                            order.address.state,
                            order.address.zipCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {order.address.country && (
                          <p>{order.address.country}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
              {order.specialInstructions && (
                <p className="flex items-start gap-2">
                  <span className="font-medium w-32">Instructions:</span>
                  <span>{order.specialInstructions}</span>
                </p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCreditCard /> Payment Details
            </h2>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="font-medium w-32">Payment Method:</span>
                <span className="flex items-center gap-1">
                  {order.paymentMethod === "online" ? (
                    <FaCreditCard className="text-gray-500" />
                  ) : (
                    <FaMoneyBill className="text-gray-500" />
                  )}
                  {order.paymentMethod.charAt(0).toUpperCase() +
                    order.paymentMethod.slice(1)}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium w-32">Payment Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full border ${getPaymentStatusColor(
                    order.paymentStatus
                  )}`}
                >
                  {order.paymentStatus === "paid" ? (
                    <FaCheckCircle className="mr-1" />
                  ) : (
                    <MdOutlineDangerous className="mr-1" />
                  )}
                  {order.paymentStatus.charAt(0).toUpperCase() +
                    order.paymentStatus.slice(1)}
                </span>
              </p>
              {order.paymentId && (
                <p className="flex items-center gap-2">
                  <span className="font-medium w-32">Payment ID:</span>
                  <span className="font-mono text-sm">{order.paymentId}</span>
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaInfoCircle /> Order Summary
            </h2>

            {order.menuItems && order.menuItems.length > 0 ? (
              <div className="space-y-2">
                <div className="border-b pb-2">
                  <div className="grid grid-cols-4 font-medium text-sm">
                    <span>Item</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Price</span>
                    <span className="text-right">Total Price</span>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.menuItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 text-sm">
                      <span>{item.menuId.name}</span>
                      <span className="text-center">{item.quantity}</span>
                      <span className="text-right">₹ {item.price}</span>
                      <span className="text-right">
                        ₹ {item.quantity * item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No items in this order</p>
            )}

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center font-bold">
                <span>Total Amount</span>
                <span className="text-xl">₹{order.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-right">
            {order.status === "delivered" && (
              <button
                className="bg-orange-500 py-2 px-2 rounded-lg font-bold text-white"
                onClick={cancelOrder}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
