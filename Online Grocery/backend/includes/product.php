<?php
require_once 'config.php';

// Get All Products
function getAllProducts() {
    global $conn;
    $query = "SELECT * FROM products WHERE stock_quantity > 0";
    $result = $conn->query($query);
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Get Product by ID
function getProductById($product_id) {
    global $conn;
    $query = "SELECT * FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    return $result->fetch_assoc();
}

// Get Products by Category
function getProductsByCategory($category) {
    global $conn;
    $query = "SELECT * FROM products WHERE category = ? AND stock_quantity > 0";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $category);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Get All Categories
function getAllCategories() {
    global $conn;
    $query = "SELECT DISTINCT category FROM products ORDER BY category";
    $result = $conn->query($query);
    $categories = array();
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row['category'];
    }
    return $categories;
}

// Add Product (Admin Function)
function addProduct($product_name, $category, $price, $stock_quantity, $description, $image_path) {
    global $conn;
    
    $query = "INSERT INTO products (product_name, category, price, stock_quantity, description, image_path) 
              VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssidis", $product_name, $category, $price, $stock_quantity, $description, $image_path);
    
    if ($stmt->execute()) {
        $stmt->close();
        return array('status' => true, 'message' => 'Product added successfully');
    } else {
        $stmt->close();
        return array('status' => false, 'message' => 'Failed to add product');
    }
}

// Update Product Stock
function updateProductStock($product_id, $quantity) {
    global $conn;
    
    $query = "UPDATE products SET stock_quantity = stock_quantity - ? WHERE product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $quantity, $product_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        return true;
    } else {
        $stmt->close();
        return false;
    }
}
?>
