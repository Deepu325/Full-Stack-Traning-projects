<?php
require_once 'config.php';

// Add to Cart
function addToCart($user_id, $product_id, $quantity) {
    global $conn;
    
    // Check if product is already in cart
    $check_query = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("ii", $user_id, $product_id);
    $check_stmt->execute();
    $result = $check_stmt->get_result();
    $check_stmt->close();
    
    if ($result->num_rows > 0) {
        // Update quantity
        $cart_item = $result->fetch_assoc();
        $new_quantity = $cart_item['quantity'] + $quantity;
        return updateCartItem($user_id, $product_id, $new_quantity);
    } else {
        // Insert new item
        $insert_query = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
        $insert_stmt = $conn->prepare($insert_query);
        $insert_stmt->bind_param("iii", $user_id, $product_id, $quantity);
        
        if ($insert_stmt->execute()) {
            $insert_stmt->close();
            return array('status' => true, 'message' => 'Added to cart');
        } else {
            $insert_stmt->close();
            return array('status' => false, 'message' => 'Failed to add to cart');
        }
    }
}

// Get Cart Items
function getCartItems($user_id) {
    global $conn;
    
    $query = "SELECT c.cart_id, c.product_id, c.quantity, p.product_name, p.price, p.image_path 
              FROM cart c 
              JOIN products p ON c.product_id = p.product_id 
              WHERE c.user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Get Cart Count
function getCartCount($user_id) {
    global $conn;
    
    $query = "SELECT SUM(quantity) as count FROM cart WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    
    return $row['count'] ? $row['count'] : 0;
}

// Get Cart Total
function getCartTotal($user_id) {
    global $conn;
    
    $query = "SELECT SUM(p.price * c.quantity) as total 
              FROM cart c 
              JOIN products p ON c.product_id = p.product_id 
              WHERE c.user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    
    return $row['total'] ? $row['total'] : 0;
}

// Update Cart Item Quantity
function updateCartItem($user_id, $product_id, $quantity) {
    global $conn;
    
    if ($quantity <= 0) {
        return removeFromCart($user_id, $product_id);
    }
    
    $query = "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("iii", $quantity, $user_id, $product_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        return array('status' => true, 'message' => 'Cart updated');
    } else {
        $stmt->close();
        return array('status' => false, 'message' => 'Failed to update cart');
    }
}

// Remove from Cart
function removeFromCart($user_id, $product_id) {
    global $conn;
    
    $query = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ii", $user_id, $product_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        return array('status' => true, 'message' => 'Removed from cart');
    } else {
        $stmt->close();
        return array('status' => false, 'message' => 'Failed to remove from cart');
    }
}

// Clear Cart
function clearCart($user_id) {
    global $conn;
    
    $query = "DELETE FROM cart WHERE user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    
    if ($stmt->execute()) {
        $stmt->close();
        return true;
    } else {
        $stmt->close();
        return false;
    }
}
?>
