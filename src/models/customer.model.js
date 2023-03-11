const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      enum: ["anonymous", "customer"],
      default: "customer",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
      },
    ],
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
