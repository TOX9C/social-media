const { Router } = require("express");
const postRouter = Router();
const { authenticateUser } = require("../auth");
const postController = require("../controllers/postController");

postRouter.post("/make", authenticateUser, postController.make);
postRouter.get("/get", authenticateUser, postController.get);
postRouter.post("/like", authenticateUser, postController.like);
postRouter.post("/post", authenticateUser, postController.getPost);
postRouter.post("/userPosts", authenticateUser, postController.userPosts);

module.exports = postRouter;
