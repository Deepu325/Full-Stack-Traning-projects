<?php
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? 'status';

if ($action === 'register') {
    $data = getRequestBody();
    $username = trim($data['username'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$email || !$password) {
        jsonResponse(['error' => 'Missing fields'], 400);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)');
        $stmt->execute([$username, $email, $hash]);
        $userId = $pdo->lastInsertId();

        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;

        jsonResponse(['message' => 'Registered successfully', 'user' => ['user_id' => $userId, 'username' => $username]]);
    } catch (PDOException $e) {
        $msg = $e->getMessage();
        if (str_contains($msg, 'Duplicate')) {
            jsonResponse(['error' => 'Username or email already exists'], 409);
        }
        jsonResponse(['error' => 'Could not register user', 'details' => $msg], 500);
    }
}

if ($action === 'login') {
    $data = getRequestBody();
    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$password) {
        jsonResponse(['error' => 'Missing username or password'], 400);
    }

    $stmt = $pdo->prepare('SELECT user_id, username, password_hash FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid credentials'], 401);
    }

    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['username'] = $user['username'];

    jsonResponse(['message' => 'Logged in', 'user' => ['user_id' => $user['user_id'], 'username' => $user['username']]]);
}

if ($action === 'logout') {
    session_unset();
    session_destroy();
    jsonResponse(['message' => 'Logged out']);
}

if ($action === 'status') {
    if (!empty($_SESSION['user_id'])) {
        jsonResponse(['authenticated' => true, 'user' => ['user_id' => $_SESSION['user_id'], 'username' => $_SESSION['username']]]);
    }
    jsonResponse(['authenticated' => false]);
}

jsonResponse(['error' => 'Invalid action'], 400);
