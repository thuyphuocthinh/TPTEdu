const md5 = require("md5");
const Settings = require("../../models/general-settings.model");
const Users = require("../../models/users.model");

const getLogin = async (req, res) => {
  try {
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
const getOrders = async (req, res) => {};
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
const postUpdatePassword = async (req, res) => {};
const postUpdateProfile = async (req, res) => {};

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
  postUpdatePassword,
  postUpdateProfile,
};
