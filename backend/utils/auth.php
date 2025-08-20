<?php
// ----- CORS START -----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    'http://localhost:3000',
    'https://etraincon.com',
];
if (in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-User-Id, Accept');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
// ----- CORS END -----

// Sessions across origins (SameSite=None requires secure cookies)
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'domain'   => 'etraincon.com',
    'secure'   => true,         // must be true for SameSite=None
    'httponly' => true,
    'samesite' => 'None',
]);
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

/**
 * Use your real auth/session after login sets $_SESSION['user_id'].
 * For testing, you can pass header: X-User-Id: 1
 */
function require_user_id(): int {
    header('Content-Type: application/json');

    if (isset($_SESSION['user_id'])) {
        return (int)$_SESSION['user_id'];
    }
    if (!empty($_SERVER['HTTP_X_USER_ID'])) {
        return (int)$_SERVER['HTTP_X_USER_ID'];
    }

    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Not authenticated']);
    exit;
}
