const { Router } = require("express");
const authController = require("../controllers/authController.js");
const authRouter = Router();
const { authenticateUser } = require("../auth");
const multer = require("multer");

const upload = multer();
authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.get("/me", authController.getUser);
authRouter.post(
  "/me/uploadpfp",
  authenticateUser,
  upload.single("file"),
  authController.uploadpfp,
);

module.exports = authRouter;
