require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();
const app = express();

// Configure CORS to allow Vercel deployments
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
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
}));

app.use(express.json());

const httpServer = createServer(app);

const { setupSocket } = require("./socket");
const { io, onlineUsers } = setupSocket(httpServer);

const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const messageRouter = require("./routes/messageRouter");
const commentRouter = require("./routes/commentRouter");
const followRouter = require("./routes/followRouter");
const searchRouter = require("./routes/SearchRouter.js");
const notiRouter = require("./routes/notiRouter.js");

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/message", messageRouter);
app.use("/comment", commentRouter);
app.use("/follow", followRouter);
app.use("/search", searchRouter);
app.use("/noti", notiRouter);

module.exports = { io, onlineUsers };

const startServer = async () => {
  try {
    await prisma.$connect();
    httpServer.listen(process.env.PORT, () => {
      console.log("✅ Server running on port 3000");
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
