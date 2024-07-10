const express = require("express");
const app = express();
const dotenv = require("dotenv");
const database = require("./config/database.config");
const adminRoute = require("./routes/admin/index.route");
const clientsRoute = require("./routes/clients/index.route");
const { prefixAdmin } = require("./config/system.config");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");

// dotenv
dotenv.config();

// database
database.connect();

// static file
app.use("/public", express.static(path.join(__dirname, "public")));
app.locals.prefixAdmin = prefixAdmin;

// flash
app.use(cookieParser("TPT"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

// method-override
app.use(methodOverride('_method'))

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// routes
adminRoute(app);
clientsRoute(app);

// view engine
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
