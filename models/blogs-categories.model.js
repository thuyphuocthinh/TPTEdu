const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const blogsCategoriesSchema = new mongoose.Schema(
  {
    parent_category_id: String,
    title: String,
    status: String, 
    position: Number,
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

const BlogsCategories = mongoose.model("BlogsCategories", blogsCategoriesSchema, "blogs-categories");
module.exports = BlogsCategories;
