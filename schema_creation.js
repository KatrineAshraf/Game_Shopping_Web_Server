var mysql = require('mysql');

 // MySQL configuration
 var connection = mysql.createConnection({
    host: "mysql-328ebb90-gameshopping.i.aivencloud.com",
    password: "AVNS_xCFD6r0IrZ1TDEvWWX4",
    port: 18879,
    user: "avnadmin",
  
  });
  
    connection.connect(function(err) {
      if (err) throw err;
      console.log("Database Connected!");
  });

function deleteDB(name){
var sql =  `DROP DATABASE IF EXISTS ${name}` 
  connection.query(sql, function (err) {
    if (err) throw err;
    console.log(`Database ${name} is deleted`);
})

}
function createDB(name){
    var sql =  `CREATE DATABASE ${name}` 
  connection.query(sql, function (err) {
    if (err) throw err;
    console.log(`Database ${name} is created successfully`);
})
}
function UseDB(name){
    var sql =  `USE ${name}` 
  connection.query(sql, function (err) {
    if (err) throw err;
    console.log(`Database ${name} is in use`);
})
}
function TableCreation(){
    var sql = `CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    fname VARCHAR(25) NOT NULL, 
    lname VARCHAR(25) NOT NULL, 
    email VARCHAR(50) NOT NULL UNIQUE,  
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00, 
    password VARCHAR(8)
);`
connection.query(sql, function (err) {
    if (err) throw err;
    console.log(`Table customers is created successfully`);
})
sql = `CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    p_name VARCHAR(25), 
    image VARCHAR(300), 
    price DECIMAL(10,2), 
    qty INT
);`
connection.query(sql, function (err) {
    if (err) throw err;
    console.log(`Table products is created successfully`);
})
sql = `CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    c_id INT NOT NULL, 
    p_id INT NOT NULL, 
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    state INT NOT NULL DEFAULT 0
);`
connection.query(sql, function (err) {
    if (err) throw err;
    console.log(`Table order is created successfully`);
})
}
function FKConfig(){
 var sql =`  ALTER TABLE orders
    ADD FOREIGN KEY (c_id) REFERENCES customers(id);
    `
    connection.query(sql, function (err) {
        if (err) throw err;
    })
 sql = `ALTER TABLE orders
    ADD FOREIGN KEY (p_id) REFERENCES products(id);`
    connection.query(sql, function (err) {
        if (err) throw err;
        console.log(`Foreign Keys are added to table orders!`);
    })
}
function RowsInsertion(){
    var sql = `INSERT INTO products (p_name, image, price, qty) VALUES 
    ('Die Macher', 'https://cdn.shopify.com/s/files/1/1915/6645/products/die-macher-limited-edition-pledge-kickstarter-pre-order-special-retail-board-game-hans-im-gluck-13352297922604.jpg?v=1573265672', 58.84, 3),
    ('Dragonmaster', 'https://cdn.shopify.com/s/files/1/0513/4077/1515/products/dragon-master-abstract-game_1024x1024.jpg?v=1665068278', 243.36, 5),
    ('Samurai', 'https://cdn.shopify.com/s/files/1/0100/2949/8432/products/841333100544.png?v=1603291002', 670.94, 18),
    ('Tal der Könige', 'https://cf.geekdo-images.com/nYiYhUlatT2DpyXaJqXK3w__itemrep/img/g2XtJGxuWKXFXnOo7gQUN-_FT9Q=/fit-in/246x300/filters:strip_icc()/pic285299.jpg', 646.94, 4),
    ('Acquire', 'https://cdn11.bigcommerce.com/s-kftzvkkgjv/products/839/images/2397/RGS02575-acquire-box-2000px-3D-v2023__94312.1678205427.1280.1280.png?c=1', 136.79, 10),
    ('Mare Mediterraneum', 'https://cf.geekdo-images.com/277POF80AUz2ZE9XSApyDg__opengraph/img/BUBMUlCl9XOzN7kHyt9IP_r0imI=/31x0:769x387/fit-in/1200x630/filters:strip_icc()/pic28424.jpg', 175.42, 13),
    ('Cathedral', 'https://target.scene7.com/is/image/Target/GUEST_b541d48f-622e-4f20-bb86-4a65f1dca7d3?wid=488&hei=488&fmt=pjpeg', 881.74, 18),
    ('Lords of Creation', 'https://image.nobleknight.com/t/jpg240/tfwfloc.jpg', 590.52, 4),
    ('El Caballero', 'https://cf.geekdo-images.com/lWotCtplnl0sI3bS_jF3-Q__imagepage/img/liSvTUdKBrcUiEgaqZwHxegIWmo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1731731.jpg', 269.2, 16),
    ('Elfenland', 'https://cf.geekdo-images.com/Ea4jN5Ko5bPrXrU_AYhhzg__imagepage/img/RM-HmMEY4IJ7C5Ax9zW9-H2Vl2A=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1798136.jpg', 719.4, 0);`
    sql = sql.replace("\"","\'")
    connection.query(sql, function (err) {
        if (err) throw err;
        console.log(`Products are added!`);
    })
}
function CreateViews(){
    var sql = `CREATE VIEW transactions AS
SELECT  
    orders.id, 
    CONCAT_WS(' ', fname, lname) AS "name", 
    products.image, 
    products.p_name AS product, 
    products.price, 
    DATE_FORMAT(orders.ordered_at, '%d/%c/%Y @ %r') AS ordered_at, 
    orders.state
    FROM 
    ((orders
    INNER JOIN customers ON customers.id = orders.c_id)
    INNER JOIN products ON products.id = orders.p_id);`
    connection.query(sql, function (err) {
        if (err) throw err;
        console.log(`transaction view is created!`);
    })
    sql = `CREATE VIEW allcustomers AS
SELECT 
    id, 
    CONCAT_WS(' ', fname, lname) AS "name", 
    email, 
    balance
FROM customers; `
connection.query(sql, function (err) {
    if (err) throw err;
    console.log(`All Customers view is created!`);

})
}
function createSchema(DBName){
    deleteDB(DBName);
    createDB(DBName);
    UseDB(DBName);
    TableCreation();
    FKConfig();
    RowsInsertion();
    CreateViews();
    connection.end();  
    
    }
createSchema('game');