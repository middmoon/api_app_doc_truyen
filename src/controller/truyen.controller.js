// #region init
const db = require("../configs/mysql.config");
const anhTruyenPath = (id, ten, anh) => {
  return `/truyen/${id} - ${ten}/${anh}`;
};

const anhTacGiaPath = (id, ten, anh) => {
  return `/tacgia/${id} - ${ten}/${anh}`;
};
// #endregion

//#region // Danh sách truyện

async function theloai() {
  try {
    return new Promise((resolve, reject) => {
      db.query(`select * from theloai;`, (error, results, fields) => {
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

async function truyen() {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          truyen.idTruyen,
          truyen.Ten,
          DATE_FORMAT(truyen.NamPhatHanh, '%d-%m-%Y') AS NamPhatHanh,
          truyen.Anh,
          truyen.MoTa
        FROM
          truyen;`,
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

async function tacgia() {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          tacgia.idTacGia,
          tacgia.Ten,
          DATE_FORMAT(tacgia.NamSinh, '%d-%m-%Y') AS NamSinh,
          tacgia.Anh,
          tacgia.MoTa
        FROM
          tacgia;`,
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

async function tacgia_truyen() {
  try {
    return new Promise((resolve, reject) => {
      db.query(`select * from tacgia_truyen;`, (error, results, fields) => {
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

async function theloai_truyen() {
  try {
    return new Promise((resolve, reject) => {
      db.query(`select * from theloai_truyen;`, (error, results, fields) => {
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

async function user() {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          *
        FROM
          user;`,
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

async function user_yeuthich_truyen() {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          user_yeuthich_truyen.idTruyen,
          COUNT(user_yeuthich_truyen.idUser) AS LuotYeuThich
        FROM
          user_yeuthich_truyen
        GROUP BY 
          user_yeuthich_truyen.idTruyen;`,
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

//#endregion

//#region // truyện theo id

async function TheLoaiTheoId(id) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          theloai.idTheLoai,
          theloai.TenTheLoai
        FROM
          theloai
            INNER JOIN
              theloai_truyen ON theloai_truyen.idTheLoai = theloai.idTheLoai
            INNER JOIN
              truyen ON truyen.idTruyen = theloai_truyen.idTruyen
        WHERE
          truyen.idTruyen = ${id};`,
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

async function TacGiaTheoId(id) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          tacgia.idTacGia,
          tacgia.Ten
        FROM
          tacgia
              INNER JOIN
          tacgia_truyen ON tacgia_truyen.idTacGia = tacgia.idTacGia
              INNER JOIN
          truyen ON truyen.idTruyen = tacgia_truyen.idTruyen
        WHERE
          truyen.idTruyen = ${id};`,
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

async function LuotYeuThichTheoId(id) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `
        SELECT 
          COUNT(user_yeuthich_truyen.idUser) AS LuotYeuThich
        FROM
          user_yeuthich_truyen
        WHERE
          user_yeuthich_truyen.idTruyen = ${id};`,
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

async function TruyenTheoId(id) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          truyen.idTruyen,
          truyen.Ten,
          DATE_FORMAT(truyen.NamPhatHanh, '%d-%m-%Y') AS NamPhatHanh,
          truyen.Anh,
          truyen.Mota
        FROM
          truyen
        WHERE
          truyen.idTruyen = ${id};`,
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

async function DemSoChuongTheoId(id) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          COUNT(chuongtruyen.idTruyen) AS TongSoChuong
        FROM
          chuongtruyen
        WHERE
          chuongtruyen.idTruyen = ${id};`,
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

async function DanhSachChuongTheoId(id) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          chuongtruyen.idChuongTruyen, 
          chuongtruyen.SoChuong,
          COALESCE(anh_count.PAGE, 0) AS PAGE
        FROM
          chuongtruyen
          LEFT JOIN (
        SELECT 
          idTruyen,
          SoChuong,
          COUNT(Anh) AS PAGE
        FROM
          anhchuongtruyen
        WHERE
          idTruyen = ${id}
        GROUP BY
          idTruyen, SoChuong) AS anh_count ON chuongtruyen.idTruyen = anh_count.idTruyen AND chuongtruyen.SoChuong = anh_count.SoChuong
        WHERE
          chuongtruyen.idTruyen = ${id}`,
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
//#endregion

// #region nối json

function TacGia(idTruyen, tacgia_Truyen, tacGia) {
  try {
    const tg_t = tacgia_Truyen.filter((tg_t) => tg_t.idTruyen === idTruyen);
    const TacGia = tg_t.map((tg_t) => {
      const TacGia = tacGia.find((tacgia) => tacgia.idTacGia === tg_t.idTacGia);
      return {
        idTacGia: TacGia.idTacGia,
        Ten: TacGia.Ten,
        NamSinh: TacGia.NamSinh,
        Anh: anhTacGiaPath(TacGia.idTacGia, TacGia.Ten, TacGia.Anh),
        MoTa: TacGia.MoTa,
      };
    });

    return TacGia;
  } catch (error) {
    return {
      status: "error TacGia",
      error: error,
    };
  }
}

function TheLoai(idTruyen, theloai_Truyen, theLoai) {
  try {
    const tl_t = theloai_Truyen.filter((tl_t) => tl_t.idTruyen === idTruyen);
    const TheLoai = tl_t.map((tl_t) => {
      const TheLoai = theLoai.find((theloai) => theloai.idTheLoai === tl_t.idTheLoai);
      return {
        idTheLoai: TheLoai.idTheLoai,
        TenTheLoai: TheLoai.TenTheLoai,
      };
    });

    return TheLoai;
  } catch (error) {
    return {
      status: "error TheLoai",
      error: error,
    };
  }
}

function LuotYeuThich(idTruyen, userYeuThich) {
  try {
    const ytt = userYeuThich.filter((ytt) => ytt.idTruyen === idTruyen);
    return ytt[0].LuotYeuThich;
  } catch (error) {
    return {
      status: "error LuotYeuThich",
      error: error,
    };
  }
}

// #endregion

class TruyenController {
  async ById(req, res) {
    const id = req.params.idTruyen;
    try {
      const theloai = await TheLoaiTheoId(id);
      const tacgia = await TacGiaTheoId(id);
      const truyen = await TruyenTheoId(id);
      const sochuong = await DemSoChuongTheoId(id);
      const luotyeuthich = await LuotYeuThichTheoId(id);
      const danhsachchuong = await DanhSachChuongTheoId(id);

      const truyen_final = {
        idTruyen: truyen[0].idTruyen,
        Ten: truyen[0].Ten,
        NamPhatHanh: truyen[0].NamPhatHanh,
        Anh: anhTruyenPath(truyen[0].idTruyen, truyen[0].Ten, truyen[0].Anh),
        MoTa: truyen[0].Mota,
        LuotYeuThich: luotyeuthich[0].LuotYeuThich,

        TongSoChuong: sochuong[0].TongSoChuong,

        TheLoai: theloai,
        TacGia: tacgia,
        DanhSachChuong: danhsachchuong,
      };

      res.json(truyen_final);
    } catch (error) {
      res.json({
        status: "error",
        error: error,
      });
    }
  }

  async All(req, res) {
    try {
      const dsTruyen = await truyen();

      const tacgia_Truyen = await tacgia_truyen();
      const tacGia = await tacgia();

      const theloai_Truyen = await theloai_truyen();
      const theLoai = await theloai();

      const userYeuThich = await user_yeuthich_truyen();

      const apiDanhSachTruyen = dsTruyen.map((item) => {
        const idTruyen = item.idTruyen;

        return {
          idTruyen: item.idTruyen,
          Ten: item.Ten,
          NamPhatHanh: item.NamPhatHanh,
          Anh: anhTruyenPath(item.idTruyen, item.Ten, item.Anh),
          MoTa: item.MoTa,
          LuotYeuThich: LuotYeuThich(idTruyen, userYeuThich),
          TacGia: TacGia(idTruyen, tacgia_Truyen, tacGia),
          TheLoai: TheLoai(idTruyen, theloai_Truyen, theLoai),
        };
      });

      res.json(apiDanhSachTruyen);
    } catch (error) {
      res.json({
        status: "error",
        error: error,
      });
    }
  }
}

module.exports = new TruyenController();

// try {
//   return new Promise((resolve, reject) => {
//     db.query(``, (error, results, fields) => {
//       if (error) {
//         reject({
//           status: "error",
//           error: error,
//         });
//       } else {
//         resolve(JSON.parse(JSON.stringify(results)));
//       }
//     });
//   });
// } catch (error) {
//   return {
//     status: "error",
//     error: error,
//   };
// }
