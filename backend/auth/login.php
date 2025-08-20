<?php
// ---------- CORS (reflect allowed origins exactly) ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
   // Add your Next.js development URL
   $allowed_origins = [
       'http://localhost:5173',
       'http://localhost:5174', 
       'http://localhost:5175',
       'http://localhost:3000',  // Add this for Next.js dev server
       'https://etraincon.com',
   ];

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
    // If you want to use PHP sessions/cookies from React, keep this true
    header("Access-Control-Allow-Credentials: true");
}

   // Add these headers for better CORS support
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Expose-Headers: Set-Cookie");

// Short-circuit preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- Start session (only if you plan to use cookies/session) ----------
   // Update domain for development
session_set_cookie_params([
       'lifetime' => 0,
       'path' => '/',
       'domain' => $_SERVER['HTTP_HOST'] === 'localhost' ? '' : '.etraincon.com',
       'secure' => $_SERVER['HTTPS'] === 'on',  // Only true in production
       'httponly' => true,
       'samesite' => 'None',
   ]);
session_start();

// ---------- DB ----------
require __DIR__ . '/../config/db.php'; // must define $pdo (PDO)

// ---------- Helpers ----------
function json_response($status_code, $data) {
    http_response_code($status_code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

// ---------- Only POST for login ----------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(405, ['ok' => false, 'error' => 'Method not allowed']);
}

// ---------- Parse body (JSON or form) ----------
$ctype = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($ctype, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true) ?: [];
    $email = trim($payload['email'] ?? '');
    $password = (string)($payload['password'] ?? '');
} else {
    $email = trim($_POST['email'] ?? '');
    $password = (string)($_POST['password'] ?? '');
}

if ($email === '' || $password === '') {
    json_response(400, ['ok' => false, 'error' => 'Email and password are required']);
}

// ---------- Look up user ----------
$stmt = $pdo->prepare("SELECT id, username, email, password, is_verified FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// ---------- Validate ----------
if (!$user || !password_verify($password, $user['password'])) {
    // Avoid leaking whether email exists
    json_response(401, ['ok' => false, 'error' => 'Invalid email or password']);
}

if ((int)$user['is_verified'] !== 1) {
    // Don’t return an HTML link; let the frontend route the user
    json_response(403, [
        'ok' => false,
        'error' => 'Account not verified',
        'code' => 'UNVERIFIED',
        'email' => $user['email'],
    ]);
}

// ---------- Success: set session (optional) ----------
$_SESSION['user_id'] = (int)$user['id'];
$_SESSION['username'] = $user['username'] ?? null;

// Return minimal profile; do NOT send password hash
json_response(200, [
    'ok' => true,
    'user' => [
        'id' => (int)$user['id'],
        'username' => $user['username'],
        'email' => $user['email'],
    ],
]);
