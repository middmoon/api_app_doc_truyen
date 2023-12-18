require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const userController = require("../../controller/user.controller");
const userRouter = express.Router();

function authenCookieToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "Loi Token") {
        return res.status(401).json({ status: "error", message: "Token Het Han" });
      } else {
        return res.sendStatus(403);
      }
    }
    req.user = decoded;
    next();
  });

  // try {
  //   const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  //   req.user = user;
  //   next();
  // } catch (error) {
  //   res.clearCookie("token");
  //   return res.redirect("/");
  // }
}

function authenToken(req, res, next) {
  const authorizationHeader = req.headers["authorization"];
  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "Loi Token") {
        return res.status(401).json({ status: "error", message: "Token Het Han" });
      } else {
        return res.sendStatus(403);
      }
    }
    req.user = decoded;
    next();
  });
}

userRouter.get("/liked", authenToken, userController.liked);

module.exports = userRouter;
