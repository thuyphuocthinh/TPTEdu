const getNotFound = async (req, res) => {
  res.render("admin/pages/errors/notFound", {
    pageTitle: "Không tìm thấy",
  });
};

const getUnauthorized = async (req, res) => {
  res.render("admin/pages/errors/unauthorized", {
    pageTitle: "Không đủ quyền truy cập",
  });
};

module.exports = {
  getNotFound,
  getUnauthorized,
};
