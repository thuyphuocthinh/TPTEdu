const Carts = require("../../models/carts.model");
const Settings = require("../../models/general-settings.model");
const Courses = require("../../models/courses.model");
const { newPrice } = require("../../helpers/price");

const index = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const cartId = req.cookies.cartId;
    const cart = await Carts.findOne({ _id: cartId });
    let totalCost = 0;
    for (let i = 0; i < cart.courses.length; i++) {
      const item = cart.courses[i];
      let course = await Courses.findOne({
        _id: item.course_id,
      });
      course = newPrice(course);
      item.course = course;
      item.cost = item.course.newPrice * item.quantity;
      totalCost += item.cost;
      item.index = i + 1;
    }
    cart.totalCost = totalCost;
    res.render("clients/pages/checkout/index", {
      pageTitle: "Thông tin thanh toán",
      cart,
      settings,
      totalCost,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
};
