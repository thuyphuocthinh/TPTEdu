const Roles = require("../../models/roles.model");
const Accounts = require("../../models/accounts.model");

const index = async (req, res) => {
  try {
    const roles = await Roles.find({ deleted: false });
    roles.forEach((role, index) => {
      role.index = index;
    });
    res.render("admin/pages/permissions/index", {
      pageTitle: "Phân quyền",
      roles,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchEdit = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissionsUpdate);
    permissions.forEach(async (item) => {
      await Roles.updateOne(
        {
          _id: item.role_id,
        },
        {
          permissions: item.permissions,
        }
      );
    });
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    console.log(error);
  }
};

module.exports = {
  index,
  patchEdit,
};
