const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const rolesSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    permissions: [],
    deleted: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      slug: "title",
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

const Roles = mongoose.model("Roles", rolesSchema, "roles");
module.exports = Roles;
