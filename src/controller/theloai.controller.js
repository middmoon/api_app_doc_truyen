// #region init

const db = require("../configs/mysql.config");

const anhTruyenPath = (id, ten, anh) => {
  return `/truyen/${id} - ${ten}/${anh}`;
};

const anhTacGiaPath = (id, ten, anh) => {
  return `/tacgia/${id} - ${ten}/${anh}`;
};
// #endregion

// #region Danh Sách Thể Loại

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

async function truyentheloai(TenTheLoai) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          truyen.idTruyen,
          truyen.Ten,
          DATE_FORMAT(truyen.NamPhatHanh, '%d-%m-%Y') AS NamPhatHanh,
          truyen.Anh,
          truyen.Mota,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'idTacGia', tacgia.idTacGia,
              'Ten', tacgia.Ten,
              'Anh', tacgia.Anh,
              'MoTa', tacgia.MoTa,
              'NamSinh', DATE_FORMAT(tacgia.NamSinh, '%d-%m-%Y') )) AS TacGia
          FROM
            truyen
            INNER JOIN
                theloai_truyen ON truyen.idTruyen = theloai_truyen.idTruyen
            INNER JOIN
                theloai ON theloai.idTheLoai = theloai_truyen.idTheLoai
            INNER JOIN
                tacgia_truyen ON truyen.idTruyen = tacgia_truyen.idTruyen
            INNER JOIN
                tacgia ON tacgia.idTacGia = tacgia_truyen.idTacGia
            WHERE
                theloai.TenTheLoai = '${TenTheLoai}'
            GROUP BY 
                truyen.idTruyen;`,
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

async function truyenIdtheloai(idTheLoai) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          truyen.idTruyen,
          truyen.Ten,
          DATE_FORMAT(truyen.NamPhatHanh, '%d-%m-%Y') AS NamPhatHanh,
          truyen.Anh,
          truyen.Mota,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'idTacGia', tacgia.idTacGia,
              'Ten', tacgia.Ten,
              'Anh', tacgia.Anh,
              'MoTa', tacgia.MoTa,
              'NamSinh', tacgia.NamSinh)) AS TacGia
          FROM
            truyen
            INNER JOIN
                theloai_truyen ON truyen.idTruyen = theloai_truyen.idTruyen
            INNER JOIN
                theloai ON theloai.idTheLoai = theloai_truyen.idTheLoai
            INNER JOIN
                tacgia_truyen ON truyen.idTruyen = tacgia_truyen.idTruyen
            INNER JOIN
                tacgia ON tacgia.idTacGia = tacgia_truyen.idTacGia
            WHERE
                theloai.TenTheLoai = ${idTheLoai}
            GROUP BY 
                truyen.idTruyen;`,
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

// #endregion

class TheLoaiController {
  async DanhSachTheLoai(req, res) {
    try {
      const theLoai = await theloai();
      res.json(theLoai);
    } catch (error) {
      res.json({
        status: "error",
        error: error,
      });
    }
  }

  async ByTheLoai(req, res) {
    const TenTheLoai = req.params.TenTheLoai;
    try {
      const truyentheotheloai = await truyentheloai(TenTheLoai);

      const result = truyentheotheloai.map((item) => {
        return {
          idTruyen: item.idTruyen,
          Ten: item.TenTruyen,
          NamPhatHanh: item.NamPhatHanh,
          MoTa: item.MotaTruyen,
          Anh: anhTruyenPath(item.idTruyen, item.TenTruyen, item.AnhTruyen),

          TacGia: JSON.parse(item.TacGia).map((item2) => {
            return {
              idTacGia: item2.idTacGia,
              Ten: item2.Ten,
              NamSinh: item2.NamSinh,
              Anh: anhTacGiaPath(item2.idTacGia, item2.Ten, item2.Anh),
              MoTa: item2.MoTa,
            };
          }),
        };
      });

      res.json(result);
    } catch (error) {
      res.json({
        status: "error",
        error: error,
      });
    }
  }

  async ByidTheLoai(req, res) {
    const idTheLoai = req.params.idTheLoai;
    try {
      const truyentheotheloai = await truyenIdtheloai(idTheLoai);

      const result = truyentheotheloai.map((item) => {
        return {
          idTruyen: item.idTruyen,
          Ten: item.TenTruyen,
          NamPhatHanh: item.NamPhatHanh,
          MoTa: item.MotaTruyen,
          Anh: anhTruyenPath(item.idTruyen, item.TenTruyen, item.AnhTruyen),

          TacGia: JSON.parse(item.TacGia).map((item2) => {
            return {
              idTacGia: item2.idTacGia,
              Ten: item2.Ten,
              NamSinh: item2.NamSinh,
              Anh: anhTacGiaPath(item2.idTacGia, item2.Ten, item2.Anh),
              MoTa: item2.MoTa,
            };
          }),
        };
      });

      res.json(result);
    } catch (error) {
      res.json({
        status: "error",
        error: error,
      });
    }
  }
}

module.exports = new TheLoaiController();

// #region Truyện Theo Tên Thể Loại

// #endregion
