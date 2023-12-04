const db = require("../configs/mysql.config");
const path = require("path");
const fs = require("fs");

const userVersion = {
  user: "user",
  user_v2: "user_v2",
  user_v2_demo: "user_v2_demo",
};

const userPath = path.join(__dirname, "..", "public/user");

const createUser_db = (body) => {
  return new Promise((resolve, reject) => {
    try {
      db.query(
        `INSERT INTO ${userVersion.user} (Ten, Email, TenDangNhap, MatKhau) 
          VALUE ("${body.hoten}", "${body.email}", "${body.tendangnhap}", "${body.matkhau}");`,
        (error, result, fields) => {
          if (error) {
            reject({
              status: "error",
              message: error,
            });
          } else {
            resolve(body.tendangnhap);
          }
        }
      );
    } catch (error) {
      reject({
        status: "error",
        message: error,
      });
    }
  });
};

const createUser_sys = async (tendangnhap) => {
  const userFolder = tendangnhap;
  if (!fs.existsSync(path.join(userPath, userFolder))) {
    fs.mkdirSync(path.join(userPath, userFolder), { recursive: true });
  }
};

class UserController {
  async createUser(req, res) {
    const body = req.body;
    try {
      const tendangnhap = await createUser_db(body);
      createUser_sys(tendangnhap);
      res.send({
        tendangnhap: tendangnhap,
      });
    } catch (error) {
      res.send({
        status: "error",
        message: error,
      });
    }
  }

  // async getAllUsers(req, res) {
  //   try {
  //     db.query(`SELECT * FROM ${userVersion.user_v2}`, (error, result, fields) => {
  //       if (error) {
  //         res.send({
  //           status: "error",
  //           message: error,
  //         });
  //       } else {
  //         res.send({
  //           status: "good",
  //           message: JSON.parse(JSON.stringify(result)),
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     res.send({
  //       status: "error",
  //       message: error,
  //     });
  //   }
  // }

  // async getUser(req, res) {
  //   try {
  //     const id = req.params.id;
  //     db.query(`SELECT * FROM ${userVersion.user_v2} WHERE id = "${id}";`, (error, result, fields) => {
  //       if (error) {
  //         res.send({
  //           status: "error",
  //           message: error,
  //         });
  //       } else {
  //         res.send({
  //           status: "good",
  //           message: JSON.parse(JSON.stringify(result)),
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     res.send({
  //       status: "error",
  //       message: error,
  //     });
  //   }
  // }

  // async deleteUser(req, res) {
  //   try {
  //     const id = req.params.id;
  //     db.query(`DELETE FROM user_v2 WHERE id = "${id}";`, (error, result, fields) => {
  //       if (error) {
  //         res.send({
  //           status: "error",
  //           message: error,
  //         });
  //       } else {
  //         res.send({
  //           status: `good`,
  //           message: `delete user_v2 ${id} succesfully`,
  //         });
  //       }
  //     });
  //   } catch (error) {
  //     res.send({
  //       status: "error",
  //       message: error,
  //     });
  //   }
  // }
}

module.exports = new UserController();
