require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as per your frontend origin
    methods: ["GET", "POST"]
  }
});

const connectedUsers = {};

const handleSocketConnection = (socket, io) => {
  const userId = socket.handshake.query.userId;
  const role = socket.handshake.query.role || "user"; // Default role is "user"

  if (userId) {
    connectedUsers[userId] = { socketId: socket.id, role };
    console.log(`User ${userId} connected.`, connectedUsers);
  }

  socket.on("sendOrderUpdate", ({ userId, orderData }) => {
    const user = connectedUsers[userId];
    if (user) {
      io.to(user.socketId).emit("orderUpdate", orderData);
      console.log(`Order update sent to ${userId}:`, orderData);
    } else {
      console.log(`User ${userId} not found for order update.`);
    }
  });

  socket.on("sendReservationUpdate", ({ reservationData }) => {
    Object.values(connectedUsers).forEach((user) => {
      if (user.role === "admin") {
        io.to(user.socketId).emit("reservationUpdate", reservationData);
      }
    });
  });

  socket.on("disconnect", () => {
    if (userId && connectedUsers[userId]) {
      delete connectedUsers[userId];
      console.log(`User ${userId} disconnected. Updated Users:`, connectedUsers);
    }
  });
};

io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

app.post("/notify", (req, res) => {
  const { orderId, status, userId } = req.body;

  if (connectedUsers[userId]) {
    io.to(connectedUsers[userId].socketId).emit("orderUpdate", { orderId, status });
    res.json({ message: `Notification sent to user ${userId}` });
  } else {
    res.status(404).json({ message: `User ${userId} not connected.` });
  }
});

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => console.log(`Socket.io server running on port ${PORT}`));
