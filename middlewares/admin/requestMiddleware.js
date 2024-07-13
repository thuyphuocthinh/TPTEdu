const { prefixAdmin } = require("../../config/system.config");

const getReq = (req, res, next) => {
  const role = res.locals.role;
  const permissions = role.permissions.join(",");
  if (
    permissions.includes("view") ||
    permissions.includes("edit") ||
    permissions.includes("create") ||
    permissions.includes("delete")
  ) {
    next();
  } else {
    res.redirect(`${prefixAdmin}/errors/unauthorized`);
  }
};

const postReq = (req, res, next) => {
  const role = res.locals.role;
  const permissions = role.permissions.join(",");
  if (permissions.includes("create")) {
    next();
  } else {
    res.redirect(`${prefixAdmin}/errors/unauthorized`);
  }
};

const patchReq = (req, res, next) => {
  const role = res.locals.role;
  const permissions = role.permissions.join(",");
  if (permissions.includes("edit")) {
    next();
  } else {
    res.redirect(`${prefixAdmin}/errors/unauthorized`);
  }
};

const deleteReq = (req, res, next) => {
  const role = res.locals.role;
  const permissions = role.permissions.join(",");
  if (permissions.includes("delete")) {
    next();
  } else {
    res.redirect(`${prefixAdmin}/errors/unauthorized`);
  }
};

module.exports = {
  getReq,
  postReq,
  patchReq,
  deleteReq,
};
