require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const userController = require("../../controller/user.controller");
const userRouter = express.Router();

// function authenToken(req, res, next) {
//   const authorizationHeader = req.headers["authorization"];

//   if (!authorizationHeader) {
//     return res.sendStatus(401);
//   }

//   const tokenParts = authorizationHeader.split(" ");
//   if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== "bearer") {
//     return res.sendStatus(401);
//   }

//   const token = tokenParts[1];

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) {
//       if (err.name === "Loi Token") {
//         return res.status(401).json({ status: "error", message: "Token Het Han" });
//       } else {
//         return res.sendStatus(403);
//       }
//     }
//     req.user = decoded;
//     next();
//   });
// }

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
