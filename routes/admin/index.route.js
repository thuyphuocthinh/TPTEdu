const { prefixAdmin } = require("../../config/system.config");
const coursesRoutes = require("../../routes/admin/courses.route");
const coursesCategoriesRoutes = require("../../routes/admin/courses-categories.route");
const blogsRoutes = require("../../routes/admin/blogs.route");
const blogsCategoriesRoutes = require("../../routes/admin/blogs-categories.route");
const accountsRoutes = require("../../routes/admin/accounts.route");
const rolesRoutes = require("../../routes/admin/roles.route");
const authRoutes = require("../../routes/admin/auth.route");
const permissionsRoutes = require("../../routes/admin/permissions.route");
const errorRoutes = require("../../routes/admin/error.route");
const settingsRoutes = require("../../routes/admin/general-settings.route");
const interfacesRoutes = require("../../routes/admin/interfaces.route");
// middlewares
const authMiddleware = require("../../middlewares/admin/authMiddleware");

module.exports = (app) => {
  app.use(`${prefixAdmin}/courses`, authMiddleware, coursesRoutes);
  app.use(
    `${prefixAdmin}/courses-categories`,
    authMiddleware,
    coursesCategoriesRoutes
  );
  app.use(`${prefixAdmin}/blogs`, authMiddleware, blogsRoutes);
  app.use(
    `${prefixAdmin}/blogs-categories`,
    authMiddleware,
    blogsCategoriesRoutes
  );
  app.use(`${prefixAdmin}/accounts`, authMiddleware, accountsRoutes);
  app.use(`${prefixAdmin}/roles`, authMiddleware, rolesRoutes);
  app.use(`${prefixAdmin}/permissions`, authMiddleware, permissionsRoutes);
  app.use(`${prefixAdmin}/general-settings`, authMiddleware, settingsRoutes);
  app.use(`${prefixAdmin}/interfaces`, authMiddleware, interfacesRoutes);
  app.use(`${prefixAdmin}/auth`, authRoutes);
  app.use(`${prefixAdmin}/errors`, errorRoutes);
};
