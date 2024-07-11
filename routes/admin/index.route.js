const { prefixAdmin } = require("../../config/system.config");
const coursesRoutes = require("../../routes/admin/courses.route");
const coursesCategoriesRoutes = require("../../routes/admin/courses-categories.route");
const blogsRoutes = require("../../routes/admin/blogs.route");
const blogsCategoriesRoutes = require("../../routes/admin/blogs-categories.route");
const accountsRoutes = require("../../routes/admin/accounts.route");
const rolesRoutes = require("../../routes/admin/roles.route");

module.exports = (app) => {
  app.use(`${prefixAdmin}/courses`, coursesRoutes);
  app.use(`${prefixAdmin}/courses-categories`, coursesCategoriesRoutes);
  app.use(`${prefixAdmin}/blogs`, blogsRoutes);
  app.use(`${prefixAdmin}/blogs-categories`, blogsCategoriesRoutes);
  app.use(`${prefixAdmin}/accounts`, accountsRoutes);
  app.use(`${prefixAdmin}/roles`, rolesRoutes);
};
