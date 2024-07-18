module.exports = (req, res, next) => {
  if (req.cookies.tokenUser) {
    next();
    return;
  }
  res.redirect("/users/login");
};
