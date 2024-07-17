const homeRoutes = require("../../routes/clients/home.route");
const coursesRoutes = require("../../routes/clients/courses.route");
const coursesCategoriesRoutes = require("../../routes/clients/courses_categories.route");
const searchRoutes = require("../../routes/clients/search.route");
const blogsRoutes = require("../../routes/clients/blogs.route");
const blogsCategoriesRoutes = require("../../routes/clients/blogs-categories.route");
const cartsRoutes = require("../../routes/clients/carts.route");
const checkoutsRoutes = require("../../routes/clients/checkouts.route");
// middlewares
const cartsMiddleware = require("../../middlewares/clients/carts.middleware");

module.exports = (app) => {
  app.use("/", cartsMiddleware, homeRoutes);
  app.use("/courses", cartsMiddleware, coursesRoutes);
  app.use("/courses-categories", cartsMiddleware, coursesCategoriesRoutes);
  app.use("/search", cartsMiddleware, searchRoutes);
  app.use("/blogs", cartsMiddleware, blogsRoutes);
  app.use("/blogs-categories", cartsMiddleware, blogsCategoriesRoutes);
  app.use("/carts", cartsMiddleware, cartsRoutes);
  app.use("/checkout", cartsMiddleware, checkoutsRoutes);
};
