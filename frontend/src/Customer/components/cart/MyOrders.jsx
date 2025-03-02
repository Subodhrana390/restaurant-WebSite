import axios from "axios";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClipboardList, FaRupeeSign } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/orders/customer`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        <p>{error}</p>
        <button
          onClick={fetchOrderDetails}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg font-semibold mb-4">No orders found!</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaClipboardList /> My Orders
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-left whitespace-nowrap">
              <th className="py-2 px-4">Order #</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Delivery Type</th>
              <th className="py-2 px-4">Amount & Date</th>
              {/* <th className="py-2 px-4">Date</th> */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/order/${order._id}`)}
                title="Click to view order details"
              >
                <td className="py-2 px-4">{order._id}</td>
                <td className="py-2 px-4">{order.customer.name}</td>
                <td className="py-2 px-4">{order.deliveryType}</td>
                <td className="py-2 px-4 flex items-center gap-1">
                  <FaRupeeSign /> {parseFloat(order.totalPrice).toFixed(2)}
                </td>
                <td className="py-2 px-4 flex items-center gap-1">
                  <FaCalendarAlt />{" "}
                  {new Date(order.orderTime).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrder;
