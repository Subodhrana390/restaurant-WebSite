import express from "express";
import http from "http";
import { Server } from "socket.io";
import { dbConnection } from "./Database/dbConnection.js";
import { bootstrap } from "./src/bootstrap.js";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("uploads"));

// // Store connected users (customers & employees)
// let connectedUsers = {};

// io.on("connection", (socket) => {
//   console.log("New user connected:", socket.id);

//   // When a user joins, store their socket ID
//   socket.on("join", ({ userId }) => {
//     connectedUsers[userId] = socket.id;
//     console.log(`User ${userId} connected with socket ${socket.id}`);
//   });

//   // Listen for order status updates
//   socket.on("updateOrderStatus", ({ orderId, status, customerId }) => {
//     console.log(`Order ${orderId} updated to ${status}`);

//     // Notify the customer in real-time
//     if (connectedUsers[customerId]) {
//       io.to(connectedUsers[customerId]).emit("orderStatusUpdated", {
//         orderId,
//         status,
//       });
//     }
//   });

//   // Handle disconnect
//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//     Object.keys(connectedUsers).forEach((userId) => {
//       if (connectedUsers[userId] === socket.id) {
//         delete connectedUsers[userId];
//       }
//     });
//   });
// });

dbConnection();
bootstrap(app);

app.listen(port, () => console.log(`server listening on port ${port}!`));
