const homeRoutes = require("../../routes/clients/home.route");
const coursesRoutes = require("../../routes/clients/courses.route");
const coursesCategoriesRoutes = require("../../routes/clients/courses_categories.route");
const searchRoutes = require("../../routes/clients/search.route");
const blogsRoutes = require("../../routes/clients/blogs.route");
const blogsCategoriesRoutes = require("../../routes/clients/blogs-categories.route");
const cartsRoutes = require("../../routes/clients/carts.route");
const checkoutsRoutes = require("../../routes/clients/checkouts.route");
const usersRoutes = require("../../routes/clients/users.route");
// middlewares
const cartsMiddleware = require("../../middlewares/clients/carts.middleware");
const usersMiddleware = require("../../middlewares/clients/users.middleware");

module.exports = (app) => {
  app.use("/", cartsMiddleware, usersMiddleware, homeRoutes);
  app.use("/courses", cartsMiddleware, usersMiddleware, coursesRoutes);
  app.use(
    "/courses-categories",
    cartsMiddleware,
    usersMiddleware,
    coursesCategoriesRoutes
  );
  app.use("/search", cartsMiddleware, usersMiddleware, searchRoutes);
  app.use("/blogs", cartsMiddleware, usersMiddleware, blogsRoutes);
  app.use(
    "/blogs-categories",
    cartsMiddleware,
    usersMiddleware,
    blogsCategoriesRoutes
  );
  app.use("/carts", cartsMiddleware, usersMiddleware, cartsRoutes);
  app.use("/checkout", cartsMiddleware, usersMiddleware, checkoutsRoutes);
  app.use("/users", cartsMiddleware, usersMiddleware, usersRoutes);
};
