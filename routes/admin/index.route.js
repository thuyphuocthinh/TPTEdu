const { prefixAdmin } = require("../../config/system.config");
const coursesRoutes = require("../../routes/admin/courses.route");
const coursesCategoriesRoutes = require("../../routes/admin/courses-categories.route");

module.exports = (app) => {
  app.use(`${prefixAdmin}/courses`, coursesRoutes);
  app.use(`${prefixAdmin}/courses-categories`, coursesCategoriesRoutes);
};
