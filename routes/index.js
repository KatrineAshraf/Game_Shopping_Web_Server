var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var db = require('../database');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var admin = 'admin@admin.com';
var sentdata = { username: "", password: "", email: "", state: true };
var email = "";

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
 
      queryAsync('SELECT * FROM allcustomers')
      .then((customers) =>{
        res.render('customers', { data: customers })
      });
  }
  else {
      res.redirect('/login'); // Redirect if email is not set
  }
});

router.get('/products', (req, res) => {
  if (email != '') {
    queryAsync("SELECT * FROM products")
    .then((products) => {res.render('products', { data: products, email: email })})
  }
})

router.get('/transactions', (req, res) => {
  if (email === 'admin@admin.com') {
   queryAsync("SELECT * FROM transactions ORDER BY ordered_at DESC")
   .then((transactions) => {
   
    res.render('transactions', { data: transactions, email: email });
  }) 
}
  else if (email != ''){
    console.log(email)
    queryAsync("SELECT * FROM transactions WHERE name = (SELECT name FROM customers WHERE email = ? ) ORDER BY ordered_at DESC", [email])
    .then((transactions) => {
      console.log('Transactions:', transactions); 
      res.render('transactions', { data: transactions, email: email });
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
  
  // no database connection
  if ( req.body.email === admin && req.body.password === '0000') {
    sentdata.username = 'admin'
    email = req.body.email;
    res.redirect('/admin')
    sentdata.email = req.body.email;
    sentdata.password = req.body.password;
  }
  else {
   LoginUser(req.body.email, req.body.password, res)
    }
  })

router.post('/signup', urlencodedParser, (req, res) => {
  let password = req.body.password;
  let confirm = req.body.confirm;
  
if (password != confirm) {
    sentdata.state = false;
    res.redirect('/signup');
  }

  else {
    try{
    queryAsync('SELECT * FROM customers where email =  ?', [req.body.email])
    .then((customers) => {
    if (customers.length > 0) {
      sentdata.email = "!";
      res.redirect('/signup')
    }
    else {
    adduser(req.body.email, req.body.password, req.body.lname, req.body.fname, res); 
    
    }})
    
  } catch (err) {
  console.error('Error in /user route:', err);
  res.status(500).render('error');
}
}
});

router.post('/products', urlencodedParser, (req, res) => {
 addOrder(req.body.id, sentdata.email).then(() => { res.redirect('/transactions') });
});

router.post('/process', urlencodedParser, (req, res) => {
  let id = req.body.id;
  if (req.body.process === 'Decline'){
     Rollback(id).then(() => { res.redirect('/transactions')})
      
  }
  else if (req.body.process === 'Confirm'){
        Proceed(id).then(() => { res.redirect('/transactions')})
  }
});

// functions

function LoginUser(e_mail, password, res) {
  queryAsync('SELECT * FROM customers where email = ? and password = ?', [e_mail, password])
  .then((customer) => {
     if(customer.length > 0) {
      sentdata.email = e_mail;
      sentdata.password = password;
      sentdata.username = customer[0].fname ;
      email = e_mail;
      res.redirect('/user')
    }
    else {
      sentdata.email = '!'; 
      res.redirect('/login')
    }
  })
}

function adduser(e_mail, password, lname, fname, res) {
  queryAsync('INSERT INTO customers (fname, lname, email, password) VALUES (?, ?, ?, ?)', [fname, lname, e_mail, password])
  .then(() => {
    email = e_mail;
    sentdata.password = password; ;
    sentdata.email = email;
    sentdata.username = fname;
    res.redirect('/user')
  })
    
}


async function addOrder(p_id, e_mail) {
  try {
    const [customer] = await queryAsync('SELECT * FROM customers WHERE email = ?', [e_mail]);
    if (!customer) {
      console.warn(`Could not find customer with email ${e_mail}\nreturned: ${customer}`);
      return;
    }
    await queryAsync('UPDATE products SET qty = qty - 1 WHERE id = ? AND qty > 0', [p_id]);
    await queryAsync('INSERT INTO orders (c_id, p_id) VALUES (?, ?)', [customer.id, p_id]);
    const [product] = await queryAsync('SELECT * FROM products WHERE id = ?', [p_id]);
    if (!product) {
      console.warn(`Could not find product with id ${p_id}\nreturned: ${product}`);
      return;
    }
    await queryAsync('UPDATE customers SET balance = balance + ? WHERE id = ?', [product.price, customer.id]);
    console.log('Order created');
  } catch (err) {
    console.error(err);
  }
}

async function Proceed(order_id){
  try{
  const [order] = await queryAsync('SELECT *  FROM orders WHERE id = ?', [order_id]);
  if(!order){
    console.warn(`Order id = ${order_id} was not found\nreturned: ${order}`);
    return;
  }
  await queryAsync('UPDATE customers SET balance = balance - (SELECT price FROM products WHERE id = ?) WHERE id = ?', [order.p_id, order.c_id]);
  await queryAsync('UPDATE orders SET state = 1 where id = ?', [order.id]);
  console.log("Order Confirmed!")
} catch (err) {
  console.error(err);
}
}

async function Rollback(id) {
  console.log(id);
  try {
    const [order] = await queryAsync('SELECT * FROM orders WHERE id = ?', [id]);
    if(!order){
      console.warn(`Order id = ${order_id} was not found\nreturned: ${order}`);
      return;
    }
    await queryAsync('UPDATE customers SET balance = balance - (SELECT price FROM products WHERE id = ?) WHERE id = ?', [order.p_id, order.c_id]);
    await queryAsync('UPDATE orders SET state = -1 WHERE id = ?', [order.id]);
    await queryAsync('UPDATE products SET qty = qty + 1 WHERE id = ?', [order.p_id]); 

    console.log("Order Cancelled!");
  } catch (err) {
    console.error(err);
  }
}


// async function to execute multiple sql commands in order
function queryAsync(sql, params) {

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

module.exports = router;