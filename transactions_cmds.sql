SET SQL_SAFE_UPDATES = 0;
-- when order is confirmed

update orders
set state = 1
where id = "";
update customers
set dept = dept + (select price from products where id = (select p_id from orders where id = ""))
where email= ""; 

-- when order is cancelled

update products 
set qty = qty + 1 
where id = (select p_id from orders where id="");

-- when user sees that an order is cancelled and decides to remove the row

delete from orders where id = "";

-- when requesting order

-- var c_id = select id from customers where email = "";
-- var p_id = select id from products where p_name = "";
insert into orders (c_id,p_id) values ("c_id","p_id");
update products 
set qty = qty - 1 
where id = (select p_id from orders where id="") and qty > 0;