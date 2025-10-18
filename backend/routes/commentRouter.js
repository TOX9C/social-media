const {Router} = require("express")
const commentRouter = Router()
const {authenticateUser} = require("../auth")
const commentController = require("../controllers/commentController")

commentRouter.post("/make", authenticateUser, commentController.make)

module.exports = commentRouter
