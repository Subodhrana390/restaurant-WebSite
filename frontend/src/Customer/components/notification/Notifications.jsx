import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:8080", {
      transports: ["websocket"],
      query: {
        userId: "67c0c7138c28b621a513d944",
      },
    });

    // Handle connection errors
    socket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
    });

    // Listen for order updates
    socket.on("orderUpdate", (data) => {
      setNotifications((prev) => [
        ...prev,
        {
          type: "order",
          message: `Order ID: ${data.orderId}, Status: ${data.status}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    // Listen for reservation updates
    socket.on("reservationUpdate", (data) => {
      setNotifications((prev) => [
        ...prev,
        {
          type: "reservation",
          message: `Reservation Data: ${JSON.stringify(
            data.reservationData
          )}, Status: ${data.status}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Notifications</h2>
      <button
        onClick={clearNotifications}
        style={{
          marginBottom: "10px",
          padding: "5px 10px",
          backgroundColor: "#ff4444",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Clear Notifications
      </button>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {notifications.map((notification, index) => (
          <li
            key={index}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <strong>{notification.type.toUpperCase()}:</strong>{" "}
            {notification.message}
            <br />
            <small style={{ color: "#888" }}>{notification.timestamp}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
