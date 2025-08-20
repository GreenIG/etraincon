<?php

// Allow frontend (localhost:3000) to access backend (etraincon.com)
header('Access-Control-Allow-Origin: http://localhost:5173/');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Always start the session to be able to access and destroy it.
session_start();

// Unset all of the session variables.
// $_SESSION = array() will remove all the session variables.
$_SESSION = array();

// If it's desired to kill the session, also delete the session cookie.
// Note: This will destroy the session, and not just the session data!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session.
session_destroy();

// Redirect the user back to the login page after they have logged out.
header("location: login.php");
exit;
?>