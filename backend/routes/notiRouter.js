const { Router } = require("express");
const notiRouter = Router();
const notiController = require("../controllers/notiController.js");
const { authenticateUser } = require("../auth");

notiRouter.get("/", authenticateUser, notiController.getNoti);
notiRouter.post("/delete", authenticateUser, notiController.deleteNoti);

module.exports = notiRouter;
