const { Router } = require("express");
const searchController = require("../controllers/searchController.js");
const { authenticateUser } = require("../auth");

const serachRouter = Router();

serachRouter.post("/", authenticateUser, searchController.getBoth);
serachRouter.post("/user", authenticateUser, searchController.users);
serachRouter.post("/post", authenticateUser, searchController.posts);
serachRouter.post("/searchUser", authenticateUser, searchController.searchUser);

module.exports = serachRouter;
