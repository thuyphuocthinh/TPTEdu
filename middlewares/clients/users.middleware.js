const Users = require("../../models/users.model");

module.exports = async (req, res, next) => {
  if (req.cookies.tokenUser) {
    const user = await Users.findOne({ tokenUser: req.cookies.tokenUser });
    res.locals.user = user;
  }
  next();
};
