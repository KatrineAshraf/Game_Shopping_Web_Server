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

function getCustomers(res){  
    var sql='SELECT * FROM customers';
  
}

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
function style(res){
  res.write(` <style>
    *{
    font-family: \'Cinzel\', serif;
}
body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url(\"https://images.unsplash.com/photo-1558244661-d248897f7bc4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVwZWF0aW5nJTIwcGF0dGVybnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60\");
    background-repeat: repeat-y;
    background-size: cover;
}
form{ 
    padding: 0px 65px 20px 65px;
    width:220px;
    align-self: center;
    margin-top: 15%;
    margin-bottom: 55%;
    border-radius: 22px;
    text-align: center;
    background-color: rgba(250, 235, 215, 0.956);
}
h2{
  background-color: white;
  border-radius:20px;
  padding: 10px;
}
th{
  color:brown;
}
table, th ,td{
  border: 1px black solid;
  padding: 10px;
  text-align: center;
}
table{
  background-color: rgba(250, 235, 215, 0.956);
  border-radius: 22px;
  text-align: center;
  width: 50%;
}
}
span{
    display: flex;
    justify-content: space-between;
}
h1 hr {
    margin-top: -5px;
}
button{
border-radius: 15px;
border: 0.5px solid black;
font-weight: 500;
}
form p {
    margin-left: -30px;
    margin-right: -30px;
}
input{
    margin-bottom: 15px;
    width: 100%;
    height: 25px;
    border-radius: 10px;
    border: 0.5px solid black;
padding:10px
}
a, a:hover, a:visited, a:checked{
    text-decoration: none;
  }
  </style>`)
}
