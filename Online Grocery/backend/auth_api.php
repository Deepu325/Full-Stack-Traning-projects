<?php
require_once 'includes/config.php';
require_once 'includes/auth.php';

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'register') {
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $full_name = $_POST['full_name'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    
    $result = registerUser($username, $email, $password, $full_name, $phone, $address);
    echo json_encode($result);
    exit;
}

if ($action === 'login') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    $result = loginUser($email, $password);
    echo json_encode($result);
    exit;
}

if ($action === 'logout') {
    logoutUser();
    echo json_encode(array('status' => true, 'message' => 'Logged out'));
    exit;
}

echo json_encode(array('status' => false, 'message' => 'Invalid action'));
?>
