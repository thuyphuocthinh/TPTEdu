const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const coursesSchema = new mongoose.Schema(
  {
    course_category_id: String,
    title: String,
    price: Number,
    stock: Number,
    discountPercentage: Number,
    thumbnail: String,
    description: String,
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

const Courses = mongoose.model("Courses", coursesSchema, "courses");
module.exports = Courses;
