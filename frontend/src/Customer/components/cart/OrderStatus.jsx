import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);

  useEffect(() => {
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

        // Check if payment status is "failed"
        if (response.data.order.paymentStatus === "failed") {
          setIsPaymentFailed(true);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center text-red-500 font-semibold mt-10">
        Order not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg text-center">
        {isPaymentFailed ? (
          <>
            <h1 className="text-3xl font-bold text-red-600">❌ Payment Failed!</h1>
            <p className="text-gray-600 mt-2">
              Your order ID: <span className="font-semibold">{order._id}</span>
            </p>
            <p className="text-gray-700 mt-2">
              There was an issue with your payment. Please try again.
            </p>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Return Home
              </button>
              <button
                onClick={() => navigate(`/retry-payment/${order._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Retry Payment
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-green-600">
              🎉 Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mt-2">
              Your order ID: <span className="font-semibold">{order._id}</span>
            </p>

            <div className="mt-4 text-left">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <ul className="mt-2 space-y-2">
                {order.menuItems.map((item, index) => (
                  <li key={index} className="flex justify-between text-gray-700">
                    <span>
                      {item.quantity} × {item.menuId.name}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t pt-2 text-lg font-bold text-gray-900">
                Total: ₹{order.totalPrice}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Delivery Type:</strong> {order.deliveryType}
              </p>
              {order.estimatedDeliveryTime && (
                <p className="text-gray-700">
                  <strong>Estimated Delivery:</strong>{" "}
                  {new Date(order.estimatedDeliveryTime).toLocaleTimeString()}
                </p>
              )}
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigate("/")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Return Home
              </button>
              <button
                onClick={() => navigate(`/track-order/${order._id}`)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Track Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
