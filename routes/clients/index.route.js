const homeRoutes = require("../../routes/clients/home.route");

module.exports = (app) => {
  app.use("/", homeRoutes);
};
