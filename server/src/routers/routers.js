const express = require("express")
const promptController = require("./controllers/prompt-controller")
const { sendText } = require("../controllers/prompt-controller")
const routers = express.Router()

routers.post('api/prompt', promptController.sendText)

module.exports = routers