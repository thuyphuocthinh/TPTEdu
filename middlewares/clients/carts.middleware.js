const Carts = require("../../models/carts.model");
const Courses = require("../../models/courses.model");

module.exports = async (req, res, next) => {
  if (req.cookies.cartId) {
    // already has cart
    const cart = await Carts.findOne({
      _id: req.cookies.cartId,
    });
    cart.totalQuantity = cart.courses.reduce((total, item) => {
      total += item.quantity;
      return total;
    }, 0);
    cart.courses.forEach(async (item) => {
      const course = await Courses.findOne({
        _id: item.course_id,
      });
      item.course = course;
    });
    res.locals.miniCart = cart;
  } else {
    // does not have cart yet
    try {
      const cart = new Carts();
      await cart.save();
      const expiresTime = 1000 * 60 * 24 * 365;
      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expiresTime),
      });
    } catch (error) {
      console.log(error);
    }
  }
  next();
};
