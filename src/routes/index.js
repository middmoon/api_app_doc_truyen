const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/login", require("./login"));
router.use("/register", require("./register"));
router.use("/api", require("./api"));

router.get("/", (req, res) => {
  res.render("home");
});

module.exports = router;
