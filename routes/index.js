var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var db = require('../database');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var admin = 'admin@admin.com';
var sentdata = { username: "", password: "", email: "", state: true };
var email = "";
var flag;
// GETs

router.get('/user', (req, res) => {
  if (email != '') {
    res.render("user", { name: sentdata.username });
  } 
});

router.get('/', (req, res) => {
  res.render('index')
})

router.get('/customers', (req, res) => {
  if (email == admin) {
    db.query("SELECT * from allcustomers", function (err, data, fields) {
      if (err) throw err;
      res.render('customers', { data: data })
    });
  }
  else {
    res.locals.message = 'Invalid Entry'
    res.status(err.status || 500);
    res.render('error');
  }
});

router.get('/products', (req, res) => {
  if (email != '') {
    db.query("SELECT * from products", function (err, data, fields) {
      if (err) throw err;
      res.render('products', { data: data, email: email })
    })
  }
})

router.get('/transactions', (req, res) => {
  if (email === 'admin@admin.com') {
    db.query("SELECT * from transactions order by ordered_at DESC", function (err, data, fields) {
      if (err) throw err;
      res.render('transactions', { data: data, email: email });

    })
  }
  else if (email != ''){
    db.query("SELECT * from transactions where c_id = (select id from customers where email = ? ) order by ordered_at DESC",[email], function (err, data, fields) {
      if (err) throw err;
      res.render('transactions', { data: data, email: email });

    })
  }
})

router.get('/login', (req, res) => {

  res.render("login", { email: sentdata.email, pass: sentdata.password });
  sentdata.email = ""; sentdata.password = "";
})

router.get('/signup', (req, res) => {
  res.render("signup", { state: sentdata.state, email: sentdata.email });
  sentdata.email = ""; sentdata.state = true;
})

router.get('/admin', (req, res) => {
  if (email == admin) {
    res.render("admin", { name: sentdata.username });
  }
  else {
    res.locals.message = 'Invalid Entry'
    res.status(err.status || 500);
    res.render('error');
  }
})
// POSTs

router.post('/login', urlencodedParser, (req, res) => {
  sentdata.email = req.body.email;
  sentdata.password = req.body.password;
  // no database connection
  if (sentdata.email === admin && sentdata.password === '0000') {
    sentdata.username = 'admin'
    email = sentdata.email;
    res.redirect('/admin')
  }
  else {
    LoginUser(sentdata.email, sentdata.password, res)
    }
  })

router.post('/signup', urlencodedParser, (req, res) => {
  let password = req.body.password;
  let confirm = req.body.confirm;
  sentdata.email = req.body.email;
if (password != confirm) {
    sentdata.state = false;
    res.redirect('/signup');
  }

  else {
    var sql = 'SELECT * FROM customers where email = \"' + sentdata.email+'\";'
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    console.log();
    if (data.length > 0) {
      sentdata.email = "!";
      res.redirect('/signup')
    }
    else {
       sentdata.email = req.body.email
    sentdata.password = req.body.password;
    let fname = req.body.fname;
    let lname = req.body.lname;
    adduser(sentdata.email, sentdata.password, lname, fname);
    res.redirect('/user');
    }
  })
   
  }
});

router.post('/products', urlencodedParser, (req, res) => {
  let id = req.body.id;
  addOrder(id, email);
  res.redirect('/transactions')
});

router.post('/process', urlencodedParser, (req, res) => {
  let id = req.body.id;
  if (req.body.process === 'Decline'){
       Rollback(id);
       res.redirect('/transactions')
  }
  else if (req.body.process === 'Confirm'){
         Proceed(id);
         res.redirect('/transactions')
  }
});

// functions

 function LoginUser(e_mail, password, res) {
  var flag = false;
  var sql = 'SELECT * FROM customers where email =\"'+e_mail+'\" and password = \"' + password+'\";'
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    if( data.length > 0){
      sentdata.username = ( data[0].fname) ;
      email = (data[0].email);
      res.redirect('/user')
    }
    else {
      sentdata.email = '!'; 
      res.redirect('/login')
    }
  })   
}

function adduser(e_mail, password, lname, fname) {
  var sql = 'INSERT INTO customers (fname, lname,email, password) VALUES (\"' + fname + '\",\"' + lname + '\",\"' + e_mail + '\",\"' + password + '\");';
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
  })
  email = e_mail;
  sentdata.email = email;
  sentdata.username = fname;
}

function addOrder(p_id, e_mail) {
  // get the customer id
  var sql = 'select * from customers where email = \"' + e_mail + '\" ;'
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    
  // decrement the quantity of the product  
  var sql = "update products set qty = qty - 1 where id = " + p_id + " and qty > 0;"
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
  })

 // make order
  var sql = 'insert into orders (c_id, p_id) values (' + data[0].id + ' , ' + p_id + ');'
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    console.log("Order created");
  })


// getting product's price
  var sql = "select * from products where id = " + p_id + " ;"
  db.query(sql, function (err, product, fields) {
    if (err) throw err;

    // updating customer's balance
   var sql = "update customers set balance = balance + " + product[0].price + " where id = " +  data[0].id + " ;"

  db.query(sql, function (err, data, fields) {
    if (err) throw err;
  })
  })

  })
  
}

function Proceed(order_id){
  var sql =  'select * from orders where id = ' + order_id 
  db.query(sql, function (err, order, fields) {
    if (err) throw err;
    var sql = 'update customers set balance = balance - (select price from products where id = ' + order[0].p_id + ') where id = ' +  order[0].c_id +';'
    db.query(sql, function (err, data, fields) {
      if (err) throw err;})
    var sql = 'update orders set state = 1 where id = ' + order[0].id +';'
    db.query(sql, function (err, data, fields) {
      if (err) throw err;
      console.log("Order Confirmed!")
    })
  })
}

function Rollback(id) {
  var sql =  'select * from orders where id = ' + id 
  db.query(sql, function (err, order, fields) {
    if (err) throw err;
    var sql = 'update customers set balance = balance - (select price from products where id = ' + order[0].p_id + ') where id = ' +  order[0].c_id +';'
    db.query(sql, function (err, data, fields) {
      if (err) throw err;
    
    })
    var sql = 'update orders set state = -1 where id = ' + order[0].id +';'
    db.query(sql, function (err, data, fields) {
      if (err) throw err;
    
    })
    var sql = 'update products set qty = qty + 1 where id = ' + order[0].p_id + ';'
    db.query(sql, function (err, data, fields) {
      if (err) throw err;
      console.log("Order Cancelled!")
    })
  })
}


module.exports = router;