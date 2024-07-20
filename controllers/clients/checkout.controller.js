const Carts = require("../../models/carts.model");
const Settings = require("../../models/general-settings.model");
const Courses = require("../../models/courses.model");
const Orders = require("../../models/orders.model");
const Users = require("../../models/users.model");
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

const order = async (req, res) => {
  try {
    const order = JSON.parse(req.body.order);
    const settings = await Settings.findOne();

    for (const item of order.courses) {
      const course = await Courses.findOne({ _id: item.course_id });
      item.discountPercentage = course.discountPercentage;
      item.price = course.price;
    }

    if (req.cookies.tokenUser) {
      const user = await Users.findOne({ tokenUser: req.cookies.tokenUser });
      order.user_id = user.id;
    }

    const newOrder = new Orders(order);
    await newOrder.save();

    await Carts.updateOne(
      {
        _id: newOrder.cart_id,
      },
      {
        courses: [],
      }
    );

    let totalCost = 0;
    const result = await Orders.findOne({ _id: newOrder.id });
    for (let i = 0; i < result.courses.length; i++) {
      const item = result.courses[i];
      let course = await Courses.findOne({ _id: item.course_id });
      course = newPrice(course);
      item.newPrice = course.newPrice;
      item.discountPercentage = course.discountPercentage;
      item.price = course.price;
      item.title = course.title;
      item.cost = course.newPrice * item.quantity;
      item.index = i + 1;
      totalCost += item.cost;
    }
    result.totalCost = totalCost;

    res.clearCookie("cartId");

    res.render("clients/pages/checkout/result", {
      pageTitle: "Đặt hàng thành công",
      result,
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  order,
};
