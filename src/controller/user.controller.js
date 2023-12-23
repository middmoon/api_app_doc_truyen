// #region init

require("dotenv").config();
const db = require("../configs/mysql.config");
const path = require("path");
const fs = require("fs");
const cookie = require("cookie-parser");

const jwt = require("jsonwebtoken");

const userVersion = {
  user: "user",
  user_v2: "user_v2",
  user_v2_demo: "user_v2_demo",
};

function checkUserImgPath(tendangnhap, anh) {
  const userPath = path.join(__dirname, "..", "public/user/", tendangnhap, anh);

  const defaultImagePath = `/user/user.png`;

  if (fs.existsSync(userPath)) {
    return `/user/${tendangnhap}/${anh}`;
  } else {
    return defaultImagePath;
  }
}

const anhTruyenPath = (id, ten, anh) => {
  return `/truyen/${id} - ${ten}/${anh}`;
};

const anhTacGiaPath = (id, ten, anh) => {
  return `/tacgia/${id} - ${ten}/${anh}`;
};

// #endregion

// #region check user

const checkUser = (body) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT ${userVersion.user}.TenDangNhap FROM ${userVersion.user} WHERE ${userVersion.user}.TenDangNhap = "${body.tendangnhap}"`,
      (error, result, fields) => {
        if (error) {
          reject({
            status: "error",
            message: error,
          });
        } else {
          if (result.length > 0) {
            resolve({
              status: "success",
              message: "User ton tai",
            });
          } else {
            reject({
              status: "error",
              message: "User khong ton tai",
            });
          }
        }
      }
    );
  });
};

const checkPassword = (body) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT ${userVersion.user}.MatKhau FROM ${userVersion.user} WHERE ${userVersion.user}.TenDangNhap = "${body.tendangnhap}"`,
      (error, result, fields) => {
        if (error) {
          reject({
            status: "error",
            message: error,
          });
        } else {
          if (result.length > 0) {
            if (result[0].MatKhau === body.matkhau) {
              resolve({
                status: "success",
                message: "Password dung ",
              });
            } else {
              reject({
                status: "error",
                message: "Password sai",
              });
            }
          }
        }
      }
    );
  });
};

// #endregion

// #region create user

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

// #endregion

// #region query
async function UserDetails(tendangnhap) {
  try {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM user WHERE user.TenDangNhap = "${tendangnhap}";`, (error, results, fields) => {
        if (error) {
          reject({
            status: "error",
            error: error,
          });
        } else {
          if (results.length > 0) {
            const user = results[0];
            resolve({
              idUser: user.idUser,
              Ten: user.Ten,
              Email: user.Email,
              TenDangNhap: user.TenDangNhap,
              MatKhau: user.MatKhau,
              Anh: checkUserImgPath(user.TenDangNhap, user.Anh),
            });
          } else {
            reject({
              status: "error",
              error: "User not found",
            });
          }
        }
      });
    });
  } catch (error) {
    return {
      status: "error",
      error: error,
    };
  }
}

const TruyenYeuThich = async (tendangnhap) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          truyen.idTruyen,
          truyen.Ten,
          DATE_FORMAT(truyen.NamPhatHanh, '%d-%m-%Y') AS NamPhatHanh,
          truyen.Anh,
          truyen.Mota,
          (SELECT 
                  COUNT(user_yeuthich_truyen.idUser)
              FROM
                  user_yeuthich_truyen
              WHERE
                  user_yeuthich_truyen.idTruyen = truyen.idTruyen
              GROUP BY user_yeuthich_truyen.idTruyen) AS LuotYeuThich,
          (SELECT 
                  JSON_ARRAYAGG(JSON_OBJECT('idTacGia',
                                      tacgia.idTacGia,
                                      'Ten',
                                      tacgia.Ten,
                                      'Anh',
                                      tacgia.Anh,
                                      'MoTa',
                                      tacgia.MoTa,
                                      'NamSinh',
                                      tacgia.NamSinh))
              FROM
                  tacgia
                      INNER JOIN
                  tacgia_truyen ON tacgia_truyen.idTacGia = tacgia.idTacGia
              WHERE
                  truyen.idTruyen = tacgia_truyen.idTruyen) AS TacGia,
          (SELECT 
                  JSON_ARRAYAGG(JSON_OBJECT('idTheLoai',
                                      theloai.idTheLoai,
                                      'TenTheLoai',
                                      theloai.TenTheLoai))
              FROM
                  theloai
                      INNER JOIN
                  theloai_truyen ON theloai_truyen.idTheLoai = theloai.idTheLoai
              WHERE
                  truyen.idTruyen = theloai_truyen.idTruyen) AS TheLoai
        FROM
            user
                INNER JOIN
            user_yeuthich_truyen ON user.idUser = user_yeuthich_truyen.idUser
                INNER JOIN
            truyen ON truyen.idTruyen = user_yeuthich_truyen.idTruyen
                INNER JOIN
            theloai_truyen ON truyen.idTruyen = theloai_truyen.idTruyen
                INNER JOIN
            theloai ON theloai.idTheLoai = theloai_truyen.idTheLoai
                INNER JOIN
            tacgia_truyen ON truyen.idTruyen = tacgia_truyen.idTruyen
                INNER JOIN
            tacgia ON tacgia.idTacGia = tacgia_truyen.idTacGia
        WHERE
            user.TenDangNhap = "${tendangnhap}"
        GROUP BY truyen.idTruyen;`,
        (error, results, fields) => {
          if (error) {
            reject({
              status: "error",
              error: error,
            });
          } else {
            resolve(JSON.parse(JSON.stringify(results)));
          }
        }
      );
    });
  } catch (error) {
    return {
      status: "error",
      error: error,
    };
  }
};

async function LikeTruyen(idUser, idTruyen) {
  try {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO user_yeuthich_truyen(idUser,idTruyen) VALUE (${idUser}, ${idTruyen})`, (error, results, fields) => {
        if (error) {
          reject({
            status: "error",
            error: error,
          });
        } else {
          resolve(JSON.parse(JSON.stringify(results)));
        }
      });
    });
  } catch (error) {
    return {
      status: "error",
      error: error,
    };
  }
}

async function UnLikeTruyen(idUser, idTruyen) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM user_yeuthich_truyen WHERE user_yeuthich_truyen.idUser = ${idUser} AND  user_yeuthich_truyen.idTruyen = ${idTruyen};`,
        (error, results, fields) => {
          if (error) {
            reject({
              status: "error",
              error: error,
            });
          } else {
            resolve(JSON.parse(JSON.stringify(results)));
          }
        }
      );
    });
  } catch (error) {
    return {
      status: "error",
      error: error,
    };
  }
}

async function CheckLikeTruyen(idUser, idTruyen) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM user_yeuthich_truyen WHERE user_yeuthich_truyen.idUser = ${idUser} AND  user_yeuthich_truyen.idTruyen = ${idTruyen};`,
        (error, results, fields) => {
          if (error) {
            reject({
              status: "error",
              error: error,
            });
          } else {
            if (results.length > 0) {
              resolve({
                liked: true,
                data: JSON.parse(JSON.stringify(results)),
              });
            } else {
              resolve({
                liked: false,
                data: null,
              });
            }
          }
        }
      );
    });
  } catch (error) {
    return {
      status: "error",
      error: error,
    };
  }
}

// #endregion

class UserController {
  async createUser(req, res) {
    const body = req.body;
    console.log(body);
    try {
      const tendangnhap = await createUser_db(body);
      createUser_sys(tendangnhap);
      res.send({
        tendangnhap: await User(tendangnhap),
      });
    } catch (error) {
      res.send({
        status: "error",
        message: error,
      });
    }
  }

  async login(req, res) {
    const data = req.body;
    console.log(data);
    try {
      const userExists = await checkUser(data);
      const passwordCorrect = await checkPassword(data);

      const userDetails = await UserDetails(data.tendangnhap);

      if (userExists.status === "success" && passwordCorrect.status === "success") {
        const accessToken = jwt.sign(userDetails, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "2h",
        });

        // jwt cookie

        // res.cookie("token", accressToken, {
        //   httpOnly: true,
        // });

        // return res.redirect("/");

        res.send({
          status: "success",
          message: "Xac minh thanh cong",
          userData: userDetails,
          token: accessToken,
        });
      } else {
        res.send({
          status: "error 2",
          message: "Xac minh that bai",
        });
      }
    } catch (error) {
      res.send({
        status: "error 1",
        message: error.message,
      });
    }
  }

  async liked(req, res) {
    const user = req.user;

    const truyenYeuThich = await TruyenYeuThich(user.TenDangNhap);

    const result = truyenYeuThich.map((item) => {
      return {
        idTruyen: item.idTruyen,
        Ten: item.Ten,
        NamPhatHanh: item.NamPhatHanh,
        MoTa: item.Mota,
        LuotYeuThich: item.LuotYeuThich,
        Anh: anhTruyenPath(item.idTruyen, item.Ten, item.Anh),

        TacGia: JSON.parse(item.TacGia).map((item2) => {
          return {
            idTacGia: item2.idTacGia,
            Ten: item2.Ten,
            NamSinh: item2.NamSinh,
            Anh: anhTacGiaPath(item2.idTacGia, item2.Ten, item2.Anh),
            MoTa: item2.MoTa,
          };
        }),

        TheLoai: JSON.parse(item.TheLoai).map((item3) => {
          return {
            idTheLoai: item3.idTheLoai,
            TenTheLoai: item3.TenTheLoai,
          };
        }),
      };
    });

    console.log(`truyen yeu thich cua user: ${user.tendangnhap}`);
    res.json({
      status: "success",
      userData: user,
      danhsach: result,
    });
  }

  async like(req, res) {
    const user = req.user;
    const idTruyen = req.params.idTruyen;

    res.json({
      status: "success",
      YeuThich: await LikeTruyen(user.idUser, idTruyen),
    });
  }

  async unlike(req, res) {
    const user = req.user;
    const idTruyen = req.params.idTruyen;

    res.json({
      status: "success",
      BoYeuThich: await UnLikeTruyen(user.idUser, idTruyen),
    });
  }

  async checkLike(req, res) {
    const idTruyen = req.params.idTruyen;
    const user = req.user;

    const likeResult = await CheckLikeTruyen(user.idUser, idTruyen);
    res.json({
      status: "success",
      idTruyen: idTruyen,
      userData: user,
      likeResult: likeResult,
    });
  }
}

module.exports = new UserController();
