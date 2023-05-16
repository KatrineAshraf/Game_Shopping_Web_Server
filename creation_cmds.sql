- - Database creation CREATE DATABASE task5;- - CUSTOMER TABLE CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(25) NOT NULL,
    lname varchar(25) not null,
    email varchar(50) not null unique,
    age INT NOT NULL,
    dept DECIMAL(10, 2) not null default 0.00,
    password varchar(8)
);- - View to show customers to admin create view allcustomers as
SELECT
    id,
    concat_ws(' ', fname, lname) as "name",
    email,
    dept
from
    customers;- - PRODUCTS Table CREATE TABLE products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        p_name Varchar(25) UNIQUE,
        image Varchar(300),
        price DECIMAL(10, 2),
        qty INT
    );- - products data
INSERT INTO
    products (p_name, image, price, qty)
VALUES
    (
        "Die Macher",
        "https://cdn.shopify.com/s/files/1/1915/6645/products/die-macher-limited-edition-pledge-kickstarter-pre-order-special-retail-board-game-hans-im-gluck-13352297922604.jpg?v=1573265672",
        58.84,
        3
    ),
    (
        "Dragonmaster",
        "https://cdn.shopify.com/s/files/1/0513/4077/1515/products/dragon-master-abstract-game_1024x1024.jpg?v=1665068278",
        243.36,
        5
    ),
    (
        "Samurai",
        "https://cdn.shopify.com/s/files/1/0100/2949/8432/products/841333100544.png?v=1603291002",
        670.94,
        18
    ),
    (
        "Tal der Könige",
        "https://cf.geekdo-images.com/nYiYhUlatT2DpyXaJqXK3w__itemrep/img/g2XtJGxuWKXFXnOo7gQUN-_FT9Q=/fit-in/246x300/filters:strip_icc()/pic285299.jpg",
        646.94,
        4
    ),
    (
        "Acquire",
        "https://cdn11.bigcommerce.com/s-kftzvkkgjv/products/839/images/2397/RGS02575-acquire-box-2000px-3D-v2023__94312.1678205427.1280.1280.png?c=1",
        136.79,
        10
    ),
    (
        "Mare Mediterraneum",
        "https://cf.geekdo-images.com/277POF80AUz2ZE9XSApyDg__opengraph/img/BUBMUlCl9XOzN7kHyt9IP_r0imI=/31x0:769x387/fit-in/1200x630/filters:strip_icc()/pic28424.jpg",
        175.42,
        13
    ),
    (
        "Cathedral",
        "https://target.scene7.com/is/image/Target/GUEST_b541d48f-622e-4f20-bb86-4a65f1dca7d3?wid=488&hei=488&fmt=pjpeg",
        881.74,
        18
    ),
    (
        "Lords of Creation",
        "https://image.nobleknight.com/t/jpg240/tfwfloc.jpg",
        590.52,
        4
    ),
    (
        "El Caballero",
        "https://cf.geekdo-images.com/lWotCtplnl0sI3bS_jF3-Q__imagepage/img/liSvTUdKBrcUiEgaqZwHxegIWmo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1731731.jpg",
        269.2,
        16
    ),
    (
        "Elfenland",
        "https://cf.geekdo-images.com/Ea4jN5Ko5bPrXrU_AYhhzg__imagepage/img/RM-HmMEY4IJ7C5Ax9zW9-H2Vl2A=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1798136.jpg",
        719.4,
        0
    );- - ORDERS TABLE create table orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        c_id INT NOT NULL,
        p_id INT NOT NULL,
        ordered_at timestamp default current_timestamp,
        state int not null default 0
    );- - Sample orders data
insert into
    orders (c_id, p_id)
values
    (1, 8);- - creating transactions view for all orders create view transactions as
select
    orders.id,
    concat_ws(' ', fname, lname) as "name",
    products.image,
    products.p_name,
    products.price,
    orders.ordered_at,
    orders.state
from
    (
        (
            orders
            inner join customers on customers.id = orders.c_id
        )
        inner join products on products.id = orders.p_id
    );