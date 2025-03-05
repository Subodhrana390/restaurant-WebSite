import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const connectedUsers = new Map();

const handleSocketConnection = (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    connectedUsers.set(userId, { socketId: socket.id });
    console.log(`User ${userId} connected.`, connectedUsers);
  }

  socket.on("disconnect", () => {
    if (userId && connectedUsers.has(userId)) {
      connectedUsers.delete(userId);
      console.log(
        `User ${userId} disconnected. Updated Users:`,
        connectedUsers
      );
    }
  });
};

io.on("connection", (socket) => {
  handleSocketConnection(socket);
});

app.post("/sendOrderUpdate", (req, res) => {
  const { data, userId } = req.body;
  if (!userId || !data) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const user = connectedUsers.get(userId);
  if (user) {
    io.to(user.socketId).emit("orderUpdate", data);
    res.json({ message: `Notification sent to user ${userId}` });
  } else {
    res.status(404).json({ message: `User ${userId} not connected.` });
  }
});

app.post("/reservationUpdate", (req, res) => {
  const { reservationData, status, userId } = req.body;

  if (!reservationData || !status || !userId) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const user = connectedUsers.get(userId);
  if (user) {
    io.to(user.socketId).emit("reservationUpdate", { reservationData, status });
    res.json({ message: `Notification sent to user ${userId}` });
  } else {
    res.status(404).json({ message: `User ${userId} not connected.` });
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () =>
  console.log(`Socket.io server running on port ${PORT}`)
);
