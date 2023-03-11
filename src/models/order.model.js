const mongoose = require("mongoose");
var moment = require("moment");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({
  id: ObjectId,

  orderedItem: {
    type: Number,
    ref: "Menu",
    localField: "orderedItem",
    foreignField: "id",
  },
  orderedBy: {
    type: String,
    ref: "Customer",
    localField: "orderedBy",
    foreignField: "userId",
  },
  orderedAT: {
    type: String,
    default: () => moment().format("LLLL"),
  },
});

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders;
