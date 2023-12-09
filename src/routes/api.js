const express = require("express");
const apiRoute = express.Router();

const truyenController = require("../controller/truyen.controller");
const doctruyenController = require("../controller/doctruyen.controller");
const theloaiController = require("../controller/theloai.controller");

apiRoute.get("/truyen/:idTruyen/:SoChuong", doctruyenController.doctruyen);

apiRoute.get("/truyen/:idTruyen", truyenController.ById);

apiRoute.get("/truyen", truyenController.All);

apiRoute.get("/theloai", theloaiController.DanhSachTheLoai);

apiRoute.get("/theloai/:TenTheLoai", theloaiController.ByTheLoai);

apiRoute.get("/", (req, res) => {
  res.json({
    status: "good",
    api: "co the su dung api",
  });
});
module.exports = apiRoute;
