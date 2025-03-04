import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaEye,
  FaSpinner,
  FaClipboard,
  FaCalendar,
  FaUser,
  FaTasks,
  FaRupeeSign,
  FaTimes,
  FaUtensils,
} from "react-icons/fa";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const accessToken = localStorage.getItem("token");

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/orders`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async ({ order, status }) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/orders/${order._id}/status`,
        {
          status,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      getAllOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-blue-500 mr-2" />
        <span className="text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          <FaClipboard className="inline mr-2 text-blue-500" />
          Order List
        </h2>
        <button
          onClick={() => getAllOrders()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
        >
          <FaSpinner className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left border-b">
                  <div className="flex items-center">
                    <FaClipboard className="mr-2" />
                    Order ID
                  </div>
                </th>
                <th className="py-3 px-6 text-left border-b">
                  <div className="flex items-center">
                    <FaCalendar className="mr-2" />
                    Order Date
                  </div>
                </th>
                <th className="py-3 px-6 text-left border-b">
                  <div className="flex items-center">
                    <FaUser className="mr-2" />
                    Customer
                  </div>
                </th>
                <th className="py-3 px-6 text-left border-b">
                  <div className="flex items-center">
                    <FaRupeeSign className="mr-2" />
                    Price
                  </div>
                </th>
                <th className="py-3 px-6 text-left border-b">
                  <div className="flex items-center">
                    <FaTasks className="mr-2" />
                    Status
                  </div>
                </th>
                <th className="py-3 px-6 text-center border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">
                      {order._id.substring(0, 8)}...
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(order.orderTime).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 uppercase">
                          {(order?.customer?.name || "?")[0]}
                        </div>
                      </div>
                      <span>{order?.customer?.name || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      <FaRupeeSign className="text-green-500" />{" "}
                      <span>{order.totalPrice.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <select
                      name="status"
                      value={order.status}
                      disabled={
                        order.status == "cancelled" ||
                        order.status == "delivered"
                      }
                      onChange={(e) => {
                        let status = e.target.value;
                        updateOrderStatus({ order, status });
                      }}
                      className={`rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled" disabled>
                        Cancelled
                      </option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        className="transform hover:scale-110 transition-transform duration-300 text-blue-500 hover:text-blue-700"
                        onClick={() => handleViewOrder(order)}
                      >
                        <FaEye size={18} />
                      </button>
                      {/* <button className="transform hover:scale-110 transition-transform duration-300 text-red-500 hover:text-red-700">
                        <FaTrash size={18} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 p-8 text-center border rounded-lg shadow">
          <div className="text-gray-500 text-xl">No orders found</div>
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Order Summary */}
              <div className="mb-6">
                {[
                  { label: "Order ID", value: selectedOrder._id },
                  {
                    label: "Customer",
                    value: selectedOrder.customer?.name || "Unknown",
                  },
                  {
                    label: "Email",
                    value: selectedOrder.customer?.email || "No email provided",
                  },
                  {
                    label: "Phone",
                    value: selectedOrder.customer?.phone || "No phone provided",
                  },
                  {
                    label: "Order Date",
                    value: new Date(selectedOrder.orderTime).toLocaleString(),
                  },
                  { label: "Order Status", value: selectedOrder.status },
                  {
                    label: "Payment Method",
                    value: selectedOrder.paymentMethod,
                  },
                  {
                    label: "Payment Status",
                    value: selectedOrder.paymentStatus,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-600">
                      {item.label}:
                    </span>
                    <span className="font-mono">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Order Items */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 flex items-center">
                  <FaUtensils className="mr-2 text-blue-500" />
                  Order Items
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="py-2 px-4 border-b text-left">Item</th>
                        <th className="py-2 px-4 border-b text-center">
                          Quantity
                        </th>
                        <th className="py-2 px-4 border-b text-right">Price</th>
                        <th className="py-2 px-4 border-b text-right">
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.menuItems.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {item.menuId.image && (
                                <div className="w-10 h-10 mr-3 bg-gray-200 rounded-md overflow-hidden">
                                  <img
                                    src={`${
                                      import.meta.env.VITE_IMAGE_BASE_URL
                                    }/menu/${item.menuId.image}`}
                                    alt={item.menuId.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "/api/placeholder/100/100";
                                    }}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">
                                  {item.menuId.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.menuId.isVeg ? (
                                    <span className="text-green-600">Veg</span>
                                  ) : (
                                    <span className="text-red-600">
                                      Non-veg
                                    </span>
                                  )}
                                  {item.menuId.spiceLevel && (
                                    <span className="ml-2">
                                      • {item.menuId.spiceLevel} spice
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right flex justify-center items-center">
                            <FaRupeeSign className="text-green-500" />
                            {item.price.toFixed(2)}
                            {item.menuId.discount > 0 && (
                              <div className="text-xs text-green-600 flex items-center justify-end ml-2">
                                <FaPercentage className="mr-1" />
                                {item.menuId.discount}% off
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right font-medium flex justify-center items-center">
                            <FaRupeeSign className="text-green-500" />
                            {(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
