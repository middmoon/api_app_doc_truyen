require("dotenv").config();

const express = require("express");
const userController = require("../../controller/user.controller");
const loginRouter = express.Router();

loginRouter.post("/", userController.login);

loginRouter.get("/", (req, res) => {
  res.render("login");
});

module.exports = loginRouter;
