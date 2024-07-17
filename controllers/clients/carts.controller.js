const { newPrice } = require("../../helpers/price");
const Carts = require("../../models/carts.model");
const Courses = require("../../models/courses.model");
const Settings = require("../../models/general-settings.model");

const getCart = async (req, res) => {
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
    res.render("clients/pages/carts/index", {
      pageTitle: "Chi tiết giỏ hàng",
      cart,
      settings,
      totalCost,
    });
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const courseId = req.params.courseId;
    const cart = await Carts.findOne({ _id: cartId });
    const courseExist = cart.courses.find(
      (item) => item.course_id === courseId
    );

    if (courseExist) {
      const newQuantity = courseExist.quantity + 1;
      await Carts.updateOne(
        {
          _id: cartId,
          "courses.course_id": courseId,
        },
        {
          "courses.$.quantity": newQuantity,
        }
      );
    } else {
      await Carts.updateOne(
        {
          _id: cartId,
        },
        {
          $push: {
            courses: {
              course_id: courseId,
              quantity: 1,
            },
          },
        }
      );
    }
    req.flash("success", "Đã thêm vào giỏ hàng");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const courseId = req.params.courseId;
    await Carts.updateOne(
      {
        _id: cartId,
      },
      {
        $pull: {
          courses: {
            course_id: courseId,
          },
        },
      }
    );
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

const updateQuantity = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const updatedObj = JSON.parse(req.body.updatedObj);
    await Carts.updateOne(
      {
        _id: cartId,
        "courses.course_id": updatedObj.course_id,
      },
      {
        "courses.$.quantity": updatedObj.quantity,
      }
    );
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
};
