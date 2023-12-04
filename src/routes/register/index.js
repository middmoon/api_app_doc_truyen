const express = require("express");
const userController = require("../../controller/user.controller");
const registerRoute = express.Router();

registerRoute.get("/", (req, res) => {
  res.render("register");
});

registerRoute.post("/", userController.createUser);

module.exports = registerRoute;
