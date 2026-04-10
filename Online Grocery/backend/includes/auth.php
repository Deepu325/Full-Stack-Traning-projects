<?php
require_once 'config.php';

// User Registration
function registerUser($username, $email, $password, $full_name, $phone = '', $address = '') {
    global $conn;
    
    // Validate input
    if (empty($username) || empty($email) || empty($password) || empty($full_name)) {
        return array('status' => false, 'message' => 'All fields are required');
    }
    
    // Check if user already exists
    $check_query = "SELECT user_id FROM users WHERE username = ? OR email = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("ss", $username, $email);
    $check_stmt->execute();
    $check_stmt->store_result();
    
    if ($check_stmt->num_rows > 0) {
        return array('status' => false, 'message' => 'Username or email already exists');
    }
    $check_stmt->close();
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user
    $insert_query = "INSERT INTO users (username, email, password, full_name, phone, address) 
                    VALUES (?, ?, ?, ?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bind_param("ssssss", $username, $email, $hashed_password, $full_name, $phone, $address);
    
    if ($insert_stmt->execute()) {
        $insert_stmt->close();
        return array('status' => true, 'message' => 'Registration successful. Please login.');
    } else {
        $insert_stmt->close();
        return array('status' => false, 'message' => 'Registration failed. Try again.');
    }
}

// User Login
function loginUser($email, $password) {
    global $conn;
    
    if (empty($email) || empty($password)) {
        return array('status' => false, 'message' => 'Email and password are required');
    }
    
    $query = "SELECT user_id, username, email, full_name FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return array('status' => false, 'message' => 'Invalid email or password');
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Get password from database for verification
    $query = "SELECT password FROM users WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user['user_id']);
    $stmt->execute();
    $result = $stmt->get_result();
    $password_row = $result->fetch_assoc();
    $stmt->close();
    
    if (password_verify($password, $password_row['password'])) {
        // Set session variables
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['full_name'] = $user['full_name'];
        return array('status' => true, 'message' => 'Login successful');
    } else {
        return array('status' => false, 'message' => 'Invalid email or password');
    }
}

// User Logout
function logoutUser() {
    session_destroy();
    return true;
}
?>
