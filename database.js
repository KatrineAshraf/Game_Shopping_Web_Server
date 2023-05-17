var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "Kate",
    database: "task5",
    password: "0000"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = con;