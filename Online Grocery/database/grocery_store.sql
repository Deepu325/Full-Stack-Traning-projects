-- Online Grocery Store Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS grocery_store;
USE grocery_store;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Shopping Cart Table
CREATE TABLE IF NOT EXISTS cart (
    cart_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Order Items Table (stores individual items in each order)
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

-- Insert Sample Products
INSERT INTO products (product_name, category, price, stock_quantity, description, image_path) VALUES
('Basmati Rice', 'Grains', 450.00, 100, 'Premium Basmati Rice 1kg', 'rice.jpg'),
('Whole Wheat Flour', 'Flour', 80.00, 150, 'Fresh Whole Wheat Flour 1kg', 'flour.jpg'),
('Sunflower Oil', 'Oils', 220.00, 80, 'Pure Sunflower Oil 1L', 'oil.jpg'),
('Skim Milk', 'Dairy', 65.00, 120, 'Fresh Skim Milk 500ml', 'milk.jpg'),
('Butter', 'Dairy', 420.00, 60, 'Pure Butter 100g', 'butter.jpg'),
('Eggs (Box of 6)', 'Dairy', 72.00, 200, 'Farm Fresh Eggs 6 pieces', 'eggs.jpg'),
('Fresh Tomatoes', 'Vegetables', 40.00, 250, 'Ripe Tomatoes 1kg', 'tomatoes.jpg'),
('Onions', 'Vegetables', 30.00, 300, 'Fresh Onions 1kg', 'onions.jpg'),
('Potatoes', 'Vegetables', 25.00, 400, 'Fresh Potatoes 1kg', 'potatoes.jpg'),
('Apples', 'Fruits', 120.00, 180, 'Fresh Red Apples 1kg', 'apples.jpg'),
('Bananas', 'Fruits', 60.00, 250, 'Fresh Bananas 1kg', 'bananas.jpg'),
('Lemon', 'Fruits', 55.00, 200, 'Fresh Lemon 1kg', 'lemon.jpg');
