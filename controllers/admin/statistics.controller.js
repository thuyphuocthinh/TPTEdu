const index = async (req, res) => {
  try {
    res.render("admin/pages/statistics/index", {
      pageTitle: "Thống kê",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
};
