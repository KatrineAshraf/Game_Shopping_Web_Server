var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var db = require('../database');
var username= "";
/* GET home page. */
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})
router.get('/user', (req, res) => {
  res.render("user", {name:username});
});
router.get('/', (req, res) => {
  res.render('index')
})
router.get('/customers', (req, res) => {
  db.query("SELECT * from customers", function (err, data, fields) {
    if (err) throw err;
  res.render('customers', {data: data})
  });
});
   router.get('/products', (req, res) => {
    db.query("SELECT * from products", function (err, data, fields) {
      if (err) throw err;
    res.render('products', {data: data})
  
})
   })
   router.get('/transactions', (req, res) => {
    db.query("SELECT * from transactions", function (err, data, fields) {
      if (err) throw err;
    res.render('transactions', {data: data})
  
})
   })
router.get('/login' , (req, res) => {
  res.render("login");
})
router.get('/signup', (req, res) => {
  res.render("signup");
})
router.get('/admin', (req, res) => {
  res.render("admin", {name:username});
 
})
router.post('/login', urlencodedParser, (req, res) => {
    username = req.body.username;
    let password = req.body.password;
    console.log(req.body.username, req.body.password);
    if (username === 'admin' && password === '0000') {
     res.redirect('/admin')
    }
    else if (isUser(username, password)) {
    res.redirect('/user')
    // res.write("<script>var name = "+ username+";</script>");
      //style(res);
      
    }
    else {
       // alert("No such username");
    }
})
router.post('/signup',urlencodedParser,(req,res) => {
  let password = req.body.password;
  let confirm = req.body.confirm;
  if (password != confirm){
   // alert("Please match your passwords");
  }
  else{
    username = req.body.username;
    let age = req.body.age;
    adduser(username, password, age);
  //  res.writeHead (200, {'content-type': 'text/html'})
   // res.redirect('/user')
  }
});


module.exports = router;


function isUser(username, password) {
  var found = false;
  var sql='SELECT * FROM customers';
  con.query(sql, function (err, data, fields) {
  if (err) throw err;
    if (data.length != 0) return found;
    else{
      for (var i = 0; i < data.length; i++){
        if (data[i].username == username){
          if (data[i].password == password) { found = true; break;}
          else {
           // alert("Wrong username or password")
          }
        }
      }
      return found;
    }
})
}

function adduser(username, password, age){
  var sql='INSERT INTO customers (c_name, password, age, dept) VALUES (\"'+username+'\",\"'+password+'\",'+age+', 0.0);';
  con.query(sql, function (err, data, fields) {
  if (err) throw err;
})
}
