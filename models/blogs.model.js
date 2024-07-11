const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const blogsSchema = new mongoose.Schema(
  {
    blog_category_id: String,
    title: String,
    content: String,
    thumbnail: String,
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

const Blogs = mongoose.model("Blogs", blogsSchema, "blogs");
module.exports = Blogs;
