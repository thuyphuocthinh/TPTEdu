const Accounts = require("../../models/accounts.model");
const { prefixAdmin } = require("../../config/system.config");
const Roles = require("../../models/roles.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if (!req.cookies.token) {
      res.redirect(`${prefixAdmin}/auth/login`);
    } else {
      const account = await Accounts.findOne({
        token: req.cookies.token,
        deleted: false,
      }).select("-password");
      if (account) {
        const role = await Roles.findOne({ _id: account.role_id }).select(
          "title permissions"
        );
        res.locals.account = account;
        res.locals.role = role;
        next();
      } else {
        res.redirect(`${prefixAdmin}/auth/login`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
