const mysql = require("mysql");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "test",
});

module.exports = db;
