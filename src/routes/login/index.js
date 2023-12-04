require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const loginRouter = express.Router();

//middleware
function authenToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];

  const token = authorizationHeader.split(" ")[1];
}

loginRouter.get("/", (req, res) => {
  // //Authentication: xác minh danh tính
  // const data = req.body;
  // // authorization: Ủy quyền
  // const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
  // res.json({
  //   accessToken,
  // });
});

module.exports = loginRouter;
