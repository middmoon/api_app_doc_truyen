const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "test",

  // host: "103.200.23.139",
  // user: "middmoon_test1",
  // password: "2$}qoPq]3]Yg",
  // database: "middmoon_appdoctruyen",
});

module.exports = db;
