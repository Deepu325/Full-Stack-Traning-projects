-- ===================================
-- EXAMPLE SQL QUERIES FOR GROCERY STORE
-- ===================================

-- ===== USER OPERATIONS =====

-- 1. Register a new user (INSERT)
INSERT INTO users (username, email, password, full_name, phone, address)
VALUES ('john_doe', 'john@example.com', '$2y$10$hash...', 'John Doe', '9876543210', '123 Main Street, City');

-- 2. Login - Get user by email (SELECT)
SELECT user_id, username, email, full_name FROM users WHERE email = 'john@example.com';

-- 3. Update user profile (UPDATE)
UPDATE users SET phone = '9876543211', address = '456 Oak Ave, City'
WHERE user_id = 1;

-- 4. Delete user (DELETE)
DELETE FROM users WHERE user_id = 1;

-- ===== PRODUCT OPERATIONS =====

-- 5. Get all available products (READ)
SELECT * FROM products WHERE stock_quantity > 0 ORDER BY product_name;

-- 6. Get products by category (READ with WHERE)
SELECT * FROM products WHERE category = 'Dairy' AND stock_quantity > 0;

-- 7. Get product details (READ single)
SELECT * FROM products WHERE product_id = 1;

-- 8. Get all categories (DISTINCT)
SELECT DISTINCT category FROM products ORDER BY category;

-- 9. Add new product (CREATE)
INSERT INTO products (product_name, category, price, stock_quantity, description, image_path)
VALUES ('Fresh Milk', 'Dairy', 85.00, 150, 'Fresh pasteurized milk 1L', 'milk.jpg');

-- 10. Update product price (UPDATE)
UPDATE products SET price = 95.00 WHERE product_id = 4;

-- 11. Update stock after order (UPDATE)
UPDATE products SET stock_quantity = stock_quantity - 2 WHERE product_id = 5;

-- 12. Delete out-of-stock product (DELETE)
DELETE FROM products WHERE stock_quantity = 0;

-- ===== CART OPERATIONS =====

-- 13. Add item to cart (INSERT)
INSERT INTO cart (user_id, product_id, quantity) VALUES (1, 5, 2);

-- 14. Get user's cart with product details (READ with JOIN)
SELECT c.cart_id, c.quantity, p.product_id, p.product_name, p.price, p.image_path,
       (p.price * c.quantity) as item_total
FROM cart c
JOIN products p ON c.product_id = p.product_id
WHERE c.user_id = 1;

-- 15. Get cart count (SUM)
SELECT SUM(quantity) as total_items FROM cart WHERE user_id = 1;

-- 16. Get cart total amount (SUM with JOIN)
SELECT SUM(p.price * c.quantity) as cart_total
FROM cart c
JOIN products p ON c.product_id = p.product_id
WHERE c.user_id = 1;

-- 17. Check if item already in cart (SELECT COUNT)
SELECT COUNT(*) FROM cart WHERE user_id = 1 AND product_id = 5;

-- 18. Update cart item quantity (UPDATE)
UPDATE cart SET quantity = 5 WHERE user_id = 1 AND product_id = 5;

-- 19. Remove item from cart (DELETE)
DELETE FROM cart WHERE user_id = 1 AND product_id = 5;

-- 20. Clear entire cart (DELETE)
DELETE FROM cart WHERE user_id = 1;

-- ===== ORDER OPERATIONS =====

-- 21. Create order (INSERT main table)
INSERT INTO orders (user_id, order_date, total_amount, status, delivery_address)
VALUES (1, NOW(), 1500.00, 'pending', '123 Main Street, City');

-- 22. Get order ID from insert (use LAST_INSERT_ID())
SELECT LAST_INSERT_ID() as order_id;

-- 23. Add items to order (INSERT)
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (1, 5, 2, 450.00);

-- 24. Get all user's orders (READ)
SELECT * FROM orders WHERE user_id = 1 ORDER BY order_date DESC;

-- 25. Get single order details (READ)
SELECT * FROM orders WHERE order_id = 1;

-- 26. Get order items (READ with JOIN)
SELECT oi.order_item_id, oi.quantity, oi.price,
       p.product_id, p.product_name, p.category,
       (oi.quantity * oi.price) as item_total
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
WHERE oi.order_id = 1;

-- 27. Get complete order with customer info (READ multi-table JOIN)
SELECT o.order_id, o.order_date, o.total_amount, o.status, o.delivery_address,
       u.username, u.full_name, u.email
FROM orders o
JOIN users u ON o.user_id = u.user_id
WHERE o.order_id = 1;

-- 28. Update order status (UPDATE)
UPDATE orders SET status = 'shipped' WHERE order_id = 1;

-- 29. Delete order (DELETE - cascades to order_items)
DELETE FROM orders WHERE order_id = 1;

-- ===== ANALYTICAL QUERIES =====

-- 30. Get order summary for a user
SELECT COUNT(*) as total_orders, SUM(total_amount) as total_spent,
       AVG(total_amount) as avg_order_value
FROM orders WHERE user_id = 1;

-- 31. Get top selling products
SELECT p.product_id, p.product_name, SUM(oi.quantity) as total_sold,
       SUM(oi.quantity * oi.price) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY oi.product_id
ORDER BY total_sold DESC LIMIT 5;

-- 32. Get products needing restock (low stock)
SELECT product_id, product_name, stock_quantity
FROM products
WHERE stock_quantity < 50
ORDER BY stock_quantity ASC;

-- 33. Get category-wise sales
SELECT p.category, COUNT(oi.order_item_id) as items_sold,
       SUM(oi.quantity * oi.price) as category_revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY p.category
ORDER BY category_revenue DESC;

-- 34. Get monthly order statistics
SELECT DATE_TRUNC('month', order_date) as month,
       COUNT(*) as orders, SUM(total_amount) as revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month DESC;

-- 35. Find customers who haven't ordered
SELECT u.user_id, u.username, u.email
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
WHERE o.order_id IS NULL;

-- ===== JOIN EXAMPLES =====

-- 36. INNER JOIN - Get orders with customer details
SELECT o.order_id, o.order_date, o.total_amount,
       u.username, u.email
FROM orders o
INNER JOIN users u ON o.user_id = u.user_id;

-- 37. LEFT JOIN - Get all users with their order count
SELECT u.user_id, u.username, COUNT(o.order_id) as order_count
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id;

-- 38. Multiple JOINs - Get complete order information
SELECT o.order_id, u.username, oi.product_id, p.product_name,
       oi.quantity, oi.price, (oi.quantity * oi.price) as total
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_id = 1;

-- ===== AGGREGATE FUNCTIONS =====

-- 39. COUNT - Total users
SELECT COUNT(*) as total_users FROM users;

-- 40. COUNT with WHERE - Active products
SELECT COUNT(*) as active_products FROM products WHERE stock_quantity > 0;

-- 41. SUM - Total revenue
SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'delivered';

-- 42. AVG - Average order value
SELECT AVG(total_amount) as avg_order_value FROM orders;

-- 43. MAX/MIN - Highest/Lowest priced products
SELECT MAX(price) as highest_price, MIN(price) as lowest_price FROM products;

-- 44. GROUP BY - Sales by status
SELECT status, COUNT(*) as count, SUM(total_amount) as total
FROM orders GROUP BY status;

-- ===== WINDOW FUNCTIONS (MySQL 8.0+) =====

-- 45. Row ranking by price
SELECT product_id, product_name, price,
       ROW_NUMBER() OVER (ORDER BY price DESC) as price_rank
FROM products;

-- ===== TRANSACTION EXAMPLE =====

-- 46. Create order with transaction (prevents data inconsistency)
START TRANSACTION;

INSERT INTO orders (user_id, order_date, total_amount, status, delivery_address)
VALUES (1, NOW(), 1500.00, 'pending', '123 Main Street, City');

SET @order_id = LAST_INSERT_ID();

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES (@order_id, 5, 2, 450.00);

UPDATE products SET stock_quantity = stock_quantity - 2 WHERE product_id = 5;

DELETE FROM cart WHERE user_id = 1;

COMMIT;

-- Rollback if error occurs: ROLLBACK;

-- ===== INDEX EXAMPLES (for optimization) =====

-- 47. Create index on frequently searched columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_product_category ON products(category);
CREATE INDEX idx_order_user ON orders(user_id);
CREATE INDEX idx_cart_user ON cart(user_id);

-- ===== VIEW EXAMPLES =====

-- 48. Create view for user order summary
CREATE VIEW user_order_summary AS
SELECT u.user_id, u.username, COUNT(o.order_id) as total_orders,
       SUM(o.total_amount) as total_spent
FROM users u
LEFT JOIN orders o ON u.user_id = o.user_id
GROUP BY u.user_id;

-- 49. Use the view
SELECT * FROM user_order_summary WHERE total_spent > 5000;

-- ===== STORED PROCEDURE EXAMPLE =====

-- 50. Create procedure to place order
DELIMITER //
CREATE PROCEDURE PlaceOrder(
    IN p_user_id INT,
    IN p_delivery_address TEXT
)
BEGIN
    DECLARE v_order_id INT;
    DECLARE v_total DECIMAL(10, 2);

    START TRANSACTION;

    SELECT SUM(p.price * c.quantity) INTO v_total
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = p_user_id;

    INSERT INTO orders (user_id, total_amount, delivery_address, status)
    VALUES (p_user_id, v_total, p_delivery_address, 'pending');

    SET v_order_id = LAST_INSERT_ID();

    INSERT INTO order_items (order_id, product_id, quantity, price)
    SELECT v_order_id, c.product_id, c.quantity, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = p_user_id;

    UPDATE products p
    SET stock_quantity = stock_quantity - (SELECT quantity FROM cart WHERE product_id = p.product_id AND user_id = p_user_id)
    WHERE product_id IN (SELECT product_id FROM cart WHERE user_id = p_user_id);

    DELETE FROM cart WHERE user_id = p_user_id;

    COMMIT;

    SELECT v_order_id as order_id, v_total as total_amount;
END//
DELIMITER ;

-- Call the procedure:
-- CALL PlaceOrder(1, '123 Main Street, City');
