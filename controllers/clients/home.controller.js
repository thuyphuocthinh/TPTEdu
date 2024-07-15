const Courses = require("../../models/courses.model");
const Carousels = require("../../models/carousels.model");
const Blogs = require("../../models/blogs.model");
const Settings = require("../../models/general-settings.model");
const { newPrices } = require("../../helpers/price");

const index = async (req, res) => {
  try {
    const carousels = await Carousels.find({ deleted: false });
    const settings = await Settings.findOne({ deleted: false });
    let courses = await Courses.find({
      deleted: false,
      status: "active",
    }).limit(8);
    courses = newPrices(courses);
    const blogs = await Blogs.find({ deleted: false, status: "active" })
      .limit(4)
      .sort({ position: "desc" });
    res.render("clients/pages/home/index", {
      pageTitle: "Trang chủ",
      carousels,
      courses,
      blogs,
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
};
