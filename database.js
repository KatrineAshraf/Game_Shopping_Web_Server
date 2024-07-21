var mysql = require('mysql');
var fs = require('fs');

var con = mysql.createConnection({
  host: "mysql-328ebb90-gameshopping.i.aivencloud.com",
  password: "AVNS_xCFD6r0IrZ1TDEvWWX4",
  port: 18879,
  user: "avnadmin",
  database: "game",

});

  con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});
module.exports = con;