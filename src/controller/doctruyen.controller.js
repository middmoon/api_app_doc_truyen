// #region init
const db = require("../configs/mysql.config");
const anhPath = (idTruyen, Ten, SoChuong, Anh) => {
  return `/truyen/${idTruyen} - ${Ten}/${SoChuong}/${Anh}`;
};
// #endregion

// #region query

async function ThongTinChuong(idTruyen, SoChuong) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          truyen.idTruyen, truyen.Ten, chuongtruyen.SoChuong
        FROM
          chuongtruyen,
          truyen
        WHERE
          chuongtruyen.idTruyen = truyen.idTruyen
          AND chuongtruyen.idTruyen = ${idTruyen}
            AND SoChuong = ${SoChuong};`,
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

async function AnhCuaMotChuong(idTruyen, SoChuong) {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          anhchuongtruyen.STT,
          anhchuongtruyen.Anh
        FROM
          anhchuongtruyen
        WHERE
          anhchuongtruyen.idTruyen = ${idTruyen}
            AND anhchuongtruyen.SoChuong = ${SoChuong}`,
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

// #endregion

class DocTruyenController {
  async test(req, res) {
    res.json({
      id: req.params.idTruyen,
      sochuong: req.params.SoChuong,
    });
  }

  async doctruyen(req, res) {
    const idTruyen = req.params.idTruyen;
    const SoChuong = req.params.SoChuong;

    try {
      const thongtin = await ThongTinChuong(idTruyen, SoChuong);
      const anhchuong = await AnhCuaMotChuong(idTruyen, SoChuong);

      const danhsachchuong = await DanhSachChuongTheoId(idTruyen);

      const boanh = anhchuong.map((anh) => {
        return {
          STT: anh.STT,
          Anh: anhPath(thongtin[0].idTruyen, thongtin[0].Ten, thongtin[0].SoChuong, anh.Anh),
        };
      });
      const result = {
        idTruyen: thongtin[0].idTruyen,
        Ten: thongtin[0].Ten,
        SoChuong: thongtin[0].SoChuong,
        BoAnh: boanh,
        DanhSachChuong: danhsachchuong,
      };

      res.json(result);
    } catch (error) {
      return {
        status: "error",
        error: error,
      };
    }
  }
}

module.exports = new DocTruyenController();
