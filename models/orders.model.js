const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    cart_id: String,
    userInfo: {
      email: String,
      phone: String,
      address: String,
    },
    courses: [
      {
        course_id: String,
        price: String,
        discountPercentage: Number,
        quantity: Number,
      },
    ],
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema, "orders");
module.exports = Orders;
