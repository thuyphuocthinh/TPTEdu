const md5 = require("md5");
const Accounts = require("../../models/accounts.model");
const { prefixAdmin } = require("../../config/system.config");

const getLogin = async (req, res) => {
  if (req.cookies.token) {
    const account = await Accounts.findOne({
      token: req.cookies.token,
      deleted: false,
    });
    if (account) {
      res.redirect(`${prefixAdmin}/courses`);
    } else {
      res.render("admin/pages/auth/login", {
        pageTitle: "Trang đăng nhập",
      });
    }
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Trang đăng nhập",
    });
  }
};

const postLogin = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);
    const { email, password } = req.body;
    const account = await Accounts.findOne({
      email: email,
      deleted: false,
      status: "active",
    });
    if (!account) {
      req.flash("error", "Email không tồn tại");
      res.redirect("back");
      return;
    }

    if (account.password !== password) {
      req.flash("error", "Sai mật khẩu");
      res.redirect("back");
      return;
    }

    if (account.status === "inactive") {
      req.flash(
        "error",
        "Tài khoản hiện đang bị khóa. Vui lòng liên admin để mở khóa."
      );
      res.redirect("back");
      return;
    }

    req.flash("success", "Đăng nhập thành công");
    res.cookie("token", account.token);
    res.redirect(`${prefixAdmin}/courses`);
  } catch (error) {
    req.flash("error", "Đăng nhập không thành công");
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    if (req.cookies.token) {
      res.clearCookie("token");
      req.flash("success", "Đăng xuất thành công");
      res.redirect(`${prefixAdmin}/auth/login`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLogin,
  postLogin,
  logout,
};
