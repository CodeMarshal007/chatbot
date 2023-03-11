const express = require("express");
const CustomerModel = require("../../models/customer.model");

const customerRoute = express.Router();

customerRoute.post("/");

module.exports = customerRoute;
