-- Restaurant Website Database Schema and Sample Data
-- Run this script in MySQL (or adjust for PostgreSQL/MariaDB)

CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_items (
  food_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(255),
  category VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  food_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES food_items(food_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guests INT NOT NULL,
  status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('new','seen','responded') DEFAULT 'new'
);

-- Sample data
INSERT INTO customers (name,email,phone) VALUES
('Aarav Gupta','aarav@example.com','9876543210'),
('Neha Patel','neha@example.com','9123456789');

INSERT INTO food_items (name,description,price,image_url,category) VALUES
('Margherita Pizza','Tomato, mozzarella, basil',320.00,'https://picsum.photos/id/1082/400/260','Pizza'),
('Veggie Burger','Grilled veggie patty','250.00','https://picsum.photos/id/1081/400/260','Burgers'),
('Sushi Platter','Assorted sushi',540.00,'https://picsum.photos/id/1035/400/260','Asian'),
('Pasta Alfredo','Creamy white sauce',310.00,'https://picsum.photos/id/1027/400/260','Pasta');

INSERT INTO orders (customer_id, total_amount, status) VALUES (1, 570.00, 'pending');
INSERT INTO order_items (order_id, food_id, quantity, unit_price) VALUES
(1,1,1,320.00), (1,2,1,250.00);

INSERT INTO reservations (customer_name,email,phone,reservation_date,reservation_time,guests) VALUES
('Neha Patel','neha@example.com','9123456789','2026-03-25','20:00:00',4);

INSERT INTO messages (customer_name,email,phone,message) VALUES
('Arjun Rao','arjun@example.com','9001234567','Do you offer vegan options?');

-- CRUD examples
-- SELECT
SELECT * FROM food_items;

-- INSERT
INSERT INTO messages (customer_name,email,phone,message) VALUES ('Riya Singh','riya@example.com','9012345678','Need info about birthday offers');

-- UPDATE
UPDATE reservations SET status='confirmed' WHERE reservation_id=1;

-- DELETE
DELETE FROM order_items WHERE order_item_id=1;