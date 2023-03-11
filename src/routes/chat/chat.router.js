const express = require("express");

const chatController = require("./chat.controller");
const chatRouter = express.Router();

chatRouter.get("/", chatController.startChat);

module.exports = chatRouter;
