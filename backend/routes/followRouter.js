const { Router } = require("express");
const followRouter = Router();
const { authenticateUser } = require("../auth.js");
const followController = require("../controllers/followController.js");

followRouter.post("/request", authenticateUser, followController.request);
followRouter.post("/requests", authenticateUser, followController.getRequests);
followRouter.post("/request/accept", authenticateUser, followController.accept);
followRouter.post("/request/reject", authenticateUser, followController.reject);

followRouter.get("/rand", authenticateUser, followController.getRand);
followRouter.get("/all", authenticateUser, followController.getAll);

module.exports = followRouter;
