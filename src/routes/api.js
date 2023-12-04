const express = require("express");
const apiRoute = express.Router();

const truyenController = require("../controller/truyen.controller");
const doctruyen = require("../controller/doctruyen.controller");

apiRoute.get("/truyen/:idTruyen/:SoChuong", doctruyen.doctruyen);

apiRoute.get("/truyen/:idTruyen", truyenController.ById);

apiRoute.get("/truyen", truyenController.All);

apiRoute.get("/", (req, res) => {
  res.json({
    status: "good",
    api: "co the su dung api",
  });
});
module.exports = apiRoute;
