const { prefixAdmin } = require("../../config/system.config");

const getReq = (route) => {
  return (req, res, next) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    console.log(permissions);
    if (
      permissions.includes(`${route}-view`) ||
      permissions.includes(`${route}-edit`) ||
      permissions.includes(`${route}-add`) ||
      permissions.includes(`${route}-delete`)
    ) {
      next();
    } else {
      res.redirect(`${prefixAdmin}/errors/unauthorized`);
    }
  };
};

const postReq = (route) => {
  return (req, res, next) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    if (permissions.includes(`${route}-add`)) {
      next();
    } else {
      res.redirect(`${prefixAdmin}/errors/unauthorized`);
    }
  };
};

const patchReq = (route) => {
  return (req, res, next) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    if (permissions.includes(`${route}-edit`)) {
      next();
    } else {
      res.redirect(`${prefixAdmin}/errors/unauthorized`);
    }
  };
};

const deleteReq = (route) => {
  return (req, res, next) => {
    const role = res.locals.role;
    const permissions = role.permissions.join(",");
    if (permissions.includes(`${route}-delete`)) {
      next();
    } else {
      res.redirect(`${prefixAdmin}/errors/unauthorized`);
    }
  };
};

module.exports = {
  getReq,
  postReq,
  patchReq,
  deleteReq,
};
