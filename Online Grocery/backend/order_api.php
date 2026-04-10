<?php
require_once 'includes/config.php';
require_once 'includes/order.php';
require_once 'includes/cart.php';

$action = isset($_POST['action']) ? $_POST['action'] : '';

// Check if user is logged in for order operations
if (!isLoggedIn()) {
    echo json_encode(array('status' => false, 'message' => 'Please login first'));
    exit;
}

$user_id = $_SESSION['user_id'];

if ($action === 'create_order') {
    $delivery_address = $_POST['delivery_address'] ?? '';
    
    if (empty($delivery_address)) {
        echo json_encode(array('status' => false, 'message' => 'Delivery address is required'));
        exit;
    }
    
    $result = createOrder($user_id, $delivery_address);
    echo json_encode($result);
    exit;
}

if ($action === 'get_orders') {
    $orders = getUserOrders($user_id);
    echo json_encode(array('status' => true, 'orders' => $orders));
    exit;
}

if ($action === 'get_order') {
    $order_id = $_POST['order_id'] ?? '';
    $order = getOrderDetails($order_id, $user_id);
    
    if (!$order) {
        echo json_encode(array('status' => false, 'message' => 'Order not found'));
        exit;
    }
    
    echo json_encode(array('status' => true, 'order' => $order));
    exit;
}

echo json_encode(array('status' => false, 'message' => 'Invalid action'));
?>
