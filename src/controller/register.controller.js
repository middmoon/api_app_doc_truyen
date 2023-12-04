// const {} = require("../configs/multer.config")
const db = require("../configs/mysql.config");

class RegisterController {
  index(req, res) {
    res.render("register");
  }
}

module.exports = new RegisterController();
