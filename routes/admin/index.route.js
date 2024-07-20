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
const usersRoutes = require("../../routes/admin/users.route");
const ordersRoutes = require("../../routes/admin/orders.route");
const dashboardRoutes = require("../../routes/admin/dashboard.route");
// middlewares
const authMiddleware = require("../../middlewares/admin/authMiddleware");

module.exports = (app) => {
  app.use(`${prefixAdmin}/dashboard`, authMiddleware.requireAuth, dashboardRoutes);
  app.use(`${prefixAdmin}/courses`, authMiddleware.requireAuth, coursesRoutes);
  app.use(
    `${prefixAdmin}/courses-categories`,
    authMiddleware.requireAuth,
    coursesCategoriesRoutes
  );
  app.use(`${prefixAdmin}/blogs`, authMiddleware.requireAuth, blogsRoutes);
  app.use(
    `${prefixAdmin}/blogs-categories`,
    authMiddleware.requireAuth,
    blogsCategoriesRoutes
  );
  app.use(
    `${prefixAdmin}/accounts`,
    authMiddleware.requireAuth,
    accountsRoutes
  );
  app.use(`${prefixAdmin}/roles`, authMiddleware.requireAuth, rolesRoutes);
  app.use(
    `${prefixAdmin}/permissions`,
    authMiddleware.requireAuth,
    permissionsRoutes
  );
  app.use(
    `${prefixAdmin}/general-settings`,
    authMiddleware.requireAuth,
    settingsRoutes
  );
  app.use(
    `${prefixAdmin}/interfaces`,
    authMiddleware.requireAuth,
    interfacesRoutes
  );
  app.use(`${prefixAdmin}/users`, authMiddleware.requireAuth, usersRoutes);
  app.use(`${prefixAdmin}/orders`, authMiddleware.requireAuth, ordersRoutes);
  app.use(`${prefixAdmin}/auth`, authRoutes);
  app.use(`${prefixAdmin}/errors`, errorRoutes);
};
