const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
const generator = require("../helpers/generation");
mongoose.plugin(slug);

const accountsSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    role_id: String,
    token: {
      type: String,
      default: generator.generateRandomString(30),
    },
    status: String,
    slug: {
      type: String,
      slug: "email",
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

const Accounts = mongoose.model("Accounts", accountsSchema, "accounts");
module.exports = Accounts;
