// socket.js
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();
const onlineUsers = new Map(); // ✅ Now it's a Map

function setupSocket(httpServer) {
  // Allow multiple origins for Vercel preview deployments
  const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "http://localhost:3000"
  ];

  const io = new Server(httpServer, {
    cors: {
      origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
        
        // Check if origin matches any allowed origin or Vercel pattern
        if (
          allowedOrigins.includes(origin) ||
          origin.includes('.vercel.app') ||
          origin.includes('localhost')
        ) {
          return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true
    },
  });

  io.use((socket, next) => {
    console.log(onlineUsers);
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("auth failed"));
    try {
      const user = jwt.verify(token, process.env.JWT_CODE);
      socket.userId = user.id;
      next();
    } catch {
      next(new Error("auth failed"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    console.log(`🟢 User ${socket.userId} connected`);

    socket.on("sendMessage", async ({ receiverId, content }) => {
      try {
        const isFriend = await prisma.follow.findFirst({
          where: {
            OR: [
              {
                followerId: socket.userId,
                followingId: receiverId,
                status: "ACCEPTED",
              },
              {
                followerId: receiverId,
                followingId: socket.userId,
                status: "ACCEPTED",
              },
            ],
          },
        });

        if (!isFriend)
          return socket.emit("errorMessage", "You are not friends");

        const message = await prisma.message.create({
          data: {
            content,
            senderId: socket.userId,
            receiverId,
          },
        });

        socket.emit("receiveMessage", message);
        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId)
          io.to(receiverSocketId).emit("receiveMessage", { message });
      } catch (err) {
        socket.emit("errorMessage", err.message || "Failed to send a message");
      }
    });

    // 🔴 Handle disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.userId);
      console.log(`🔴 User ${socket.userId} disconnected`);
    });
  });

  return { io, onlineUsers };
}

module.exports = { setupSocket, onlineUsers };
