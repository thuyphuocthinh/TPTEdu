const GeneralSettings = require("../../models/general-settings.model");
const { prefixAdmin } = require("../../config/system.config");

const getEdit = async (req, res) => {
  try {
    const settings = await GeneralSettings.findOne();
    res.render("admin/pages/general-settings/edit", {
      pageTitle: "Tùy chỉnh cài đặt chung",
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};
const patchEdit = async (req, res) => {
  try {
    if (!req.body.logo) {
      delete req.body.logo;
    }
    const settings = new GeneralSettings(req.body);
    await settings.save();
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${prefixAdmin}/general-settings`);
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    console.log(error);
  }
};

module.exports = {
  getEdit,
  patchEdit,
};
