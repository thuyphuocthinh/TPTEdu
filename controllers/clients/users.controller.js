const md5 = require("md5");
const Settings = require("../../models/general-settings.model");
const Users = require("../../models/users.model");
const Orders = require("../../models/orders.model");
const Courses = require("../../models/courses.model");
const ForgotPassword = require("../../models/forgotPassword.model");
const { newPrice } = require("../../helpers/price");
const { generateRandomString } = require("../../helpers/generation");
const { sendMail } = require("../../helpers/sendMail");
const generator = require("../../helpers/generation");

const getLogin = async (req, res) => {
  try {
    if (req.cookies.tokenUser) {
      res.redirect("/");
      return;
    }
    const settings = await Settings.findOne();
    res.render("clients/pages/users/login", {
      pageTitle: "Đăng nhập",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
      return;
    }

    if (user.password !== md5(password)) {
      req.flash("error", "Sai mật khẩu");
      res.redirect("back");
      return;
    }

    if (user.status === "inactive") {
      req.flash(
        "error",
        "Tài khoản hiện đang bị khóa. Liên hệ admin để mở khóa."
      );
      res.redirect("back");
      return;
    }

    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const getRegister = async (req, res) => {
  try {
    if (req.cookies.tokenUser) {
      res.redirect("/");
      return;
    }
    const settings = await Settings.findOne();
    res.render("clients/pages/users/register", {
      pageTitle: "Đăng kí",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const postRegister = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);
    req.body.tokenUser = generator.generateRandomString(30);
    const user = new Users(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);
    req.flash("success", "Đăng kí thành công");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("tokenUser");
    req.flash("Đăng xuất thành công");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.render("clients/pages/users/profile", {
      pageTitle: "Hồ sơ",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrders = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const user = await Users.findOne({ tokenUser: req.cookies.tokenUser });
    const orders = await Orders.find({
      user_id: user.id,
      status: "Pending",
    });

    for (const order of orders) {
      let totalCost = 0;
      for (const item of order.courses) {
        let course = await Courses.findOne({ _id: item.course_id });
        course = newPrice(course);
        totalCost += course.newPrice * item.quantity;
      }
      order.totalCost = totalCost;
    }

    res.render("clients/pages/users/orders", {
      pageTitle: "Đơn hàng",
      orders,
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderDetail = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const orderId = req.params.orderId;
    const order = await Orders.findOne({ _id: orderId });
    let totalCost = 0;
    for (const item of order.courses) {
      let course = await Courses.findOne({ _id: item.course_id });
      course = newPrice(course);
      item.title = course.title;
      item.price = course.newPrice;
      item.cost = item.quantity * course.newPrice;
      totalCost += item.cost;
    }
    order.totalCost = totalCost;
    res.render("clients/pages/users/orderDetail", {
      pageTitle: `Chi tiết đơn hàng #${order.id}`,
      order,
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const getPurchasedCourses = async (req, res) => {};

const getUpdatePassword = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.render("clients/pages/users/updatePassword", {
      pageTitle: "Đổi mật khẩu",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchUpdatePassword = async (req, res) => {
  try {
    const user = await Users.findOne({ tokenUser: req.cookies.tokenUser });
    if (user.password !== md5(req.body.oldPassword)) {
      req.flash("error", "Mật khẩu cũ sai");
      res.redirect("back");
      return;
    }
    if (req.body.newPassword !== req.body.confirmNewPassword) {
      req.flash("error", "Mật khẩu mới không trùng khớp");
      res.redirect("back");
      return;
    }
    await Users.updateOne(
      {
        tokenUser: req.cookies.tokenUser,
      },
      {
        password: md5(req.body.newPassword),
      }
    );
    req.flash("success", "Thay đổi mật khẩu thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

const patchUpdateProfile = async (req, res) => {
  try {
    if (!req.body.fullName) {
      delete req.body.fullName;
    }
    if (!req.body.address) {
      delete req.body.address;
    }
    if (!req.body.phone) {
      delete req.body.phone;
    }
    const tokenUser = req.cookies.tokenUser;
    await Users.updateOne(
      {
        tokenUser: tokenUser,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

// forgotPassword
const getForgotPassword = async (req, res) => {
  try {
    res.render("clients/pages/users/forgotPassword", {
      pageTitle: "Quên mật khẩu",
    });
  } catch (error) {
    console.log(error);
  }
};

const postForgotPassword = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const email = req.body.email;
    const user = await Users.findOne({ email: email });
    if (!user) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
      return;
    }

    const otp = generateRandomString(4);
    const forgotPassword = new ForgotPassword({
      otp,
      email,
    });
    await forgotPassword.save();

    const subject = "TPT-edu - MÃ OTP để lấy lại mật khẩu";
    const html = `
      <p>Đây là mã OTP: <span style="font-weight: bold;">${forgotPassword.otp}</span> </p>
      <p>Lưu ý: Mã OTP chỉ có hiệu lực 3 phút kể từ khi gửi </p>
    `;

    sendMail(email, subject, html);
    req.flash("success", "Đã gửi mã OTP");
    res.render("clients/pages/users/otp", {
      pageTitle: "Quên mật khẩu",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const postOtp = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const otp = req.body.otp;
    const forgotPassword = await ForgotPassword.findOne({ otp: otp });
    if (!forgotPassword) {
      req.flash("error", "Mã OTP không đúng");
      res.redirect("back");
      return;
    }

    res.render("clients/pages/users/resetPassword", {
      pageTitle: "Quên mật khẩu",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchResetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      req.flash("error", "Mật khẩu không trùng khớp");
      res.redirect("back");
      return;
    }

    await Users.updateOne(
      {
        tokenUser: req.cookies.tokenUser,
      },
      {
        password: md5(password),
      }
    );

    req.flash("success", "Lấy lại mật khẩu thành công");
    res.redirect("/users/login");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getProfile,
  getOrders,
  logout,
  getPurchasedCourses,
  getUpdatePassword,
  patchUpdateProfile,
  patchUpdatePassword,
  getOrderDetail,
  getForgotPassword,
  postForgotPassword,
  postOtp,
  patchResetPassword,
};
