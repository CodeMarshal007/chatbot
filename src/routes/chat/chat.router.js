const express = require("express");

const chatController = require("./chat.controller");
const chatRouter = express.Router();

chatRouter.get("/", chatController.startChat);

// chatRouter.post("/", chatController.customerOption);

// chatRouter.post("/", chatController.newOrder);
module.exports = chatRouter;
