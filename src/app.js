const express = require("express");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

// init middleware
require("dotenv").config();

app.use(morgan("dev"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// init views
app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// init public static
app.use(express.static(path.join(__dirname, "public")));

// init routes
app.use("", require("./routes"));

module.exports = app;
