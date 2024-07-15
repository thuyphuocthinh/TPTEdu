const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const carouselsSchema = new mongoose.Schema(
  {
    image: String,
    slug: {
      type: String,
      slug: "image",
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

const Carousels = mongoose.model("Carousels", carouselsSchema, "carousels");
module.exports = Carousels;
