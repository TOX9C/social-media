require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { PrismaClient } = require("./generated/prisma");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors());

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
    httpServer.listen(3000, () => {
      console.log("✅ Server running on port 3000");
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
