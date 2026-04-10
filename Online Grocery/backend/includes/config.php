<?php
// Database Configuration
define('DB_SERVER', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'grocery_store');

// Create Database Connection
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);

// Check Connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to UTF-8
$conn->set_charset("utf8");

// Session Management
session_start();

// Function to redirect
function redirect($url) {
    header("Location: " . $url);
    exit();
}

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Function to get logged in user details
function getCurrentUser() {
    if (isLoggedIn()) {
        return $_SESSION;
    }
    return null;
}
?>
