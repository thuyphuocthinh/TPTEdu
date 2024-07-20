const Carousels = require("../../models/carousels.model");
const { prefixAdmin } = require("../../config/system.config");

const getCarousels = async (req, res) => {
  try {
    const carousels = await Carousels.find({ deleted: false });
    carousels.forEach((carousel, index) => {
      carousel.index = index + 1;
    });
    res.render("admin/pages/interfaces/index", {
      pageTitle: "Giao diện",
      carousels,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCreateCarousels = async (req, res) => {
  try {
    res.render("admin/pages/interfaces/create", {
      pageTitle: "Thêm mới carousel",
    });
  } catch (error) {
    console.log(error);
  }
};

const postCreateCarousels = async (req, res) => {
  try {
    const carousel = new Carousels(req.body);
    await carousel.save();
    req.flash("success", "Thêm mới carousel thành công");
    res.redirect(`${prefixAdmin}/interfaces/carousels`);
  } catch (error) {
    req.flash("error", "Thêm mới carousel thất bại");
    console.log(error);
  }
};

const deleteCarousel = async (req, res) => {
  try {
    const id = req.params.id;
    await Carousels.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      }
    );
    req.flash("success", "Xóa carousel thành công");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Xóa carousel không thành công");
    console.log(error);
  }
};

module.exports = {
  getCarousels,
  getCreateCarousels,
  postCreateCarousels,
  deleteCarousel,
};
