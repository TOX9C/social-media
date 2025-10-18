const { Router } = require("express");
const messageRouter = Router();
const { authenticateUser } = require("../auth");
const messageController = require("../controllers/messageController");

messageRouter.post("/history", authenticateUser, messageController.history);
messageRouter.post("/", authenticateUser, messageController.getFriends);
messageRouter.post("/all", authenticateUser, messageController.all);

module.exports = messageRouter;
