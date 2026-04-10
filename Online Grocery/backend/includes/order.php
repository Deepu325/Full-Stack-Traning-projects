<?php
require_once 'config.php';

// Create Order from Cart
function createOrder($user_id, $delivery_address) {
    global $conn;
    
    // Get cart items and total
    $cart_items = getCartItems($user_id);
    
    if (empty($cart_items)) {
        return array('status' => false, 'message' => 'Cart is empty');
    }
    
    $total_amount = getCartTotal($user_id);
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert order
        $order_query = "INSERT INTO orders (user_id, total_amount, delivery_address, status) 
                        VALUES (?, ?, ?, 'pending')";
        $order_stmt = $conn->prepare($order_query);
        $order_stmt->bind_param("ids", $user_id, $total_amount, $delivery_address);
        $order_stmt->execute();
        $order_id = $conn->insert_id;
        $order_stmt->close();
        
        // Insert order items
        $item_query = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
        $item_stmt = $conn->prepare($item_query);
        
        foreach ($cart_items as $item) {
            $item_stmt->bind_param("iiii", $order_id, $item['product_id'], $item['quantity'], $item['price']);
            $item_stmt->execute();
            
            // Update product stock
            updateProductStock($item['product_id'], $item['quantity']);
        }
        $item_stmt->close();
        
        // Clear cart
        clearCart($user_id);
        
        // Commit transaction
        $conn->commit();
        return array('status' => true, 'message' => 'Order placed successfully', 'order_id' => $order_id);
        
    } catch (Exception $e) {
        $conn->rollback();
        return array('status' => false, 'message' => 'Failed to create order: ' . $e->getMessage());
    }
}

// Get User Orders
function getUserOrders($user_id) {
    global $conn;
    
    $query = "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Get Order Details
function getOrderDetails($order_id, $user_id = null) {
    global $conn;
    
    // Get order
    $order_query = "SELECT * FROM orders WHERE order_id = ?";
    if ($user_id) {
        $order_query .= " AND user_id = ?";
    }
    
    $order_stmt = $conn->prepare($order_query);
    if ($user_id) {
        $order_stmt->bind_param("ii", $order_id, $user_id);
    } else {
        $order_stmt->bind_param("i", $order_id);
    }
    $order_stmt->execute();
    $order_result = $order_stmt->get_result();
    $order_stmt->close();
    
    if ($order_result->num_rows === 0) {
        return null;
    }
    
    $order = $order_result->fetch_assoc();
    
    // Get order items
    $items_query = "SELECT oi.*, p.product_name 
                    FROM order_items oi 
                    JOIN products p ON oi.product_id = p.product_id 
                    WHERE oi.order_id = ?";
    $items_stmt = $conn->prepare($items_query);
    $items_stmt->bind_param("i", $order_id);
    $items_stmt->execute();
    $items_result = $items_stmt->get_result();
    $items_stmt->close();
    
    $order['items'] = $items_result->fetch_all(MYSQLI_ASSOC);
    
    return $order;
}

// Update Order Status (Admin)
function updateOrderStatus($order_id, $status) {
    global $conn;
    
    $valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!in_array($status, $valid_statuses)) {
        return array('status' => false, 'message' => 'Invalid status');
    }
    
    $query = "UPDATE orders SET status = ? WHERE order_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $status, $order_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        return array('status' => true, 'message' => 'Order status updated');
    } else {
        $stmt->close();
        return array('status' => false, 'message' => 'Failed to update order status');
    }
}
?>
