<?php
require_once 'includes/config.php';
require_once 'includes/product.php';
require_once 'includes/cart.php';

$action = isset($_POST['action']) ? $_POST['action'] : '';

// Check if user is logged in for cart operations
if (in_array($action, ['add_to_cart', 'remove_from_cart', 'update_cart', 'get_cart']) && !isLoggedIn()) {
    echo json_encode(array('status' => false, 'message' => 'Please login first'));
    exit;
}

if ($action === 'get_products') {
    $products = getAllProducts();
    echo json_encode(array('status' => true, 'products' => $products));
    exit;
}

if ($action === 'get_categories') {
    $categories = getAllCategories();
    echo json_encode(array('status' => true, 'categories' => $categories));
    exit;
}

if ($action === 'get_product') {
    $product_id = $_POST['product_id'] ?? '';
    $product = getProductById($product_id);
    echo json_encode(array('status' => true, 'product' => $product));
    exit;
}

if ($action === 'add_to_cart') {
    $user_id = $_SESSION['user_id'];
    $product_id = $_POST['product_id'] ?? '';
    $quantity = (int)($_POST['quantity'] ?? 1);
    
    if ($quantity < 1) {
        echo json_encode(array('status' => false, 'message' => 'Invalid quantity'));
        exit;
    }
    
    $result = addToCart($user_id, $product_id, $quantity);
    echo json_encode($result);
    exit;
}

if ($action === 'remove_from_cart') {
    $user_id = $_SESSION['user_id'];
    $product_id = $_POST['product_id'] ?? '';
    
    $result = removeFromCart($user_id, $product_id);
    echo json_encode($result);
    exit;
}

if ($action === 'update_cart') {
    $user_id = $_SESSION['user_id'];
    $product_id = $_POST['product_id'] ?? '';
    $quantity = (int)($_POST['quantity'] ?? 0);
    
    $result = updateCartItem($user_id, $product_id, $quantity);
    echo json_encode($result);
    exit;
}

if ($action === 'get_cart') {
    $user_id = $_SESSION['user_id'];
    $cart_items = getCartItems($user_id);
    $cart_total = getCartTotal($user_id);
    
    echo json_encode(array(
        'status' => true,
        'items' => $cart_items,
        'total' => $cart_total,
        'count' => count($cart_items)
    ));
    exit;
}

echo json_encode(array('status' => false, 'message' => 'Invalid action'));
?>
