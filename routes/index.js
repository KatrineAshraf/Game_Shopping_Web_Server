var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var db = require('../database');
var sentdata = {username: "", password: "", email:"", state: true};
var email =""; 
/* GET home page. */
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({extended: false})
router.get('/user', (req, res) => {
  if (email != '') {
  res.render("user", {name: sentdata.username});
}else{
  res.locals.message = 'Invalid Entry'
  res.status(err.status || 500);
  res.render('error');
} });
router.get('/', (req, res) => {
  res.render('index')
})
router.get('/customers', (req, res) => {
  if (email == 'admin@admin.com') {
  db.query("SELECT * from allcustomers", function (err, data, fields) {
    if (err) throw err;
  res.render('customers', {data: data})
  });
}
else{
  res.locals.message = 'Invalid Entry'
  res.status(err.status || 500);
  res.render('error');
}
});
   router.get('/products', (req, res) => {
    if (email == 'admin@admin.com') {
    db.query("SELECT * from products", function (err, data, fields) {
      if (err) throw err;
    res.render('products', {data: data})
    })
  }
    else{
      res.locals.message = 'Invalid Entry'
      res.status(err.status || 500);
      res.render('error');
  }
})
   router.get('/transactions', (req, res) => {
    if (email == 'admin@admin.com') {
    db.query("SELECT * from transactions", function (err, data, fields) {
      if (err) throw err;
    res.render('transactions', {data: data})
  
})
}
else{
  res.locals.message = 'Invalid Entry'
  res.status(err.status || 500);
  res.render('error');
}
   })
router.get('/login' , (req, res) => {
  res.render("login", {email: sentdata.email, pass: sentdata.password});
  sentdata.email = ""; sentdata.password ="";
})
router.get('/signup', (req, res) => {
  res.render("signup",  {state:sentdata.state, email: sentdata.email});
  sentdata.email = ""; sentdata.state = true;
})
router.get('/admin', (req, res) => {
  if (email == 'admin@admin.com') {
  res.render("admin", {name:sentdata.username});
  }
  else{
      res.locals.message = 'Invalid Entry'
      res.status(err.status || 500);
      res.render('error');
  }
})
router.post('/login', urlencodedParser, (req, res) => {
    sentdata.email = req.body.email;
    sentdata.password = req.body.password;
    // no database connection
    if (sentdata.email === 'admin@admin.com' && sentdata.password === '0000') {
      sentdata.username = 'admin'
      email = sentdata.email;
     res.redirect('/admin')
    }
    else if (LoginUser(sentdata.email, sentdata.password)) {
      email = sentdata.email
    res.redirect('/user')      
    }
    else {
      sentdata.email = "!";
      res.redirect('/login')
    }
})
router.post('/signup',urlencodedParser,(req,res) => {
  let password = req.body.password;
  let confirm = req.body.confirm;
  sentdata.email = req.body.email;
  if (isUser(sentdata.email)) {
    sentdata.email = "!";
      res.redirect('/signup')
  }
  else if (password != confirm){
    sentdata.state = false;
    res.redirect('/signup');
  }
  // needs update 
  else{
    sentdata.email = req.body.email
    sentdata.password = req.body.password;
    let fname = req.body.fname;
    let lname = req.body.lname;
    adduser(sentdata.email, sentdata.password, lname, fname);
  //  res.writeHead (200, {'content-type': 'text/html'})
   // res.redirect('/user')
  }
});


module.exports = router;

function isUser(email){
  var found = false;
  var sql='SELECT * FROM customers';
  db.query(sql, function (err, data, fields) {
  if (err) throw err;
    if (data.length != 0) return found;
    else{
      for (var i = 0; i < data.length; i++){
        if (data[i].email == email){
            found = true;
            break;
        }
      }
      return found;
    }
})
}
// needs update
function LoginUser(email, password) {
  var found = false;
  var sql='SELECT * FROM customers';
  db.query(sql, function (err, data, fields) {
  if (err) throw err;
    if (data.length != 0) return found;
    else{
      for (var i = 0; i < data.length; i++){
        if (data[i].email == email){
          if (data[i].password == password) { found = true; sentdata.username=data[i].username; break;}
          else {
           sentdata.password = "!";
           break;
          }
        }
      }
      return found;
    }
})
}
// needs update
function adduser(e_mail, password, lname, fname){
  var sql='INSERT INTO customers (fname, lname,email, password) VALUES (\"'+fname+'\",\"'+lname+'\",\"'+e_mail+'\",\"'+password+'\");';
  db.query(sql, function (err, data, fields) {
  if (err) throw err;
})
}
