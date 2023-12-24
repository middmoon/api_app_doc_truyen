require("dotenv").config();
const express = require("express");

const userController = require("../../controller/user.controller");
const userRouter = express.Router();
const { authenToken } = require("../../middleware/checkAuth.middleware");

// function authenToken(req, res, next) {
//   const authorizationHeader = req.headers["authorization"];
//   const token = authorizationHeader.split(" ")[1];

//   if (!token) {
//     return res.sendStatus(401);
//   }

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

userRouter.get("/liked", authenToken, userController.liked);

userRouter.get("/check_like/:idTruyen", authenToken, userController.checkLike);

userRouter.post("/like/:idTruyen", authenToken, userController.like);
userRouter.delete("/unlike/:idTruyen", authenToken, userController.unlike);

module.exports = userRouter;
