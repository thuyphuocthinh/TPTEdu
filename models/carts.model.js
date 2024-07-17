const mongoose = require("mongoose");

const cartsSchema = new mongoose.Schema(
  {
    user_id: String,
    courses: [
      {
        course_id: String,
        quantity: Number,
      },
    ],
  },
  { timestamps: true }
);

const Carts = mongoose.model("Carts", cartsSchema, "carts");
module.exports = Carts;
