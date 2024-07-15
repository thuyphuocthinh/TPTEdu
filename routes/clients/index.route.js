const homeRoutes = require("../../routes/clients/home.route");
const coursesRoutes = require("../../routes/clients/courses.route");
const coursesCategoriesRoutes = require("../../routes/clients/courses_categories.route");

module.exports = (app) => {
  app.use("/", homeRoutes);
  app.use("/courses", coursesRoutes);
  app.use("/courses-categories", coursesCategoriesRoutes);
};
