const mongoose = require("mongoose");
const generator = require("../helpers/generation");

const usersSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    fullName: String,
    phone: String,
    address: String,
    orders: [{ order_id: String }],
    purchased_courses: [{ course_id: String }],
    tokenUser: {
      type: String,
      default: generator.generateRandomString(30),
    },
    status: {
      type: String,
      default: "active",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      user_id: String,
      created_at: Date,
    },
    updatedBy: {
      user_id: String,
      updated_at: Date,
    },
    deletedBy: {
      user_id: String,
      updated_at: Date,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema, "users");
module.exports = Users;
