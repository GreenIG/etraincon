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
// FOR DEBUGGING ONLY: If you still get a 500 error, remove the `//` from the two lines below
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// CORRECTED PATH: This now correctly points to your db_config.php file.
require __DIR__ . '/../config/db.php';

$message = '';

// Check if a 'token' is present in the URL (e.g., from the email link)
if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Prepare a statement to find a user with the matching token who is not yet verified
    $stmt = $pdo->prepare("SELECT id FROM users WHERE verification_token = ? AND is_verified = 0");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    // Check if a user was found
    if ($user) {
        // A user with this token was found, so let's verify them.
        // We set is_verified to 1 and set the token to NULL so it can't be reused.
        $update_stmt = $pdo->prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?");
        
        if ($update_stmt->execute([$user['id']])) {
            // The update was successful
            $message = "Your email has been verified successfully! You can now log in.";
        } else {
            // The update failed for some reason
            $message = "An error occurred while verifying your account. Please try again.";
        }
    } else {
        // No user was found with this token. It's either invalid or has already been used.
        $message = "This verification link is invalid or has already been used.";
    }
} else {
    // The page was accessed without a token in the URL
    $message = "No verification token was provided. Please check the link in your email.";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - <?= isset($APP_NAME) ? $APP_NAME : 'Etraincon' ?></title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            text-align: center; 
            padding-top: 50px; 
            background-color: #f4f4f9;
            color: #333;
        }
        .container { 
            max-width: 600px; 
            margin: auto; 
            padding: 30px; 
            border: 1px solid #ddd; 
            border-radius: 8px; 
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            color: #0056b3;
        }
        a { 
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        a:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Verification</h2>
        <p><?= htmlspecialchars($message) ?></p>
        <a href="login.php">Go to Login Page</a>
    </div>
</body>
</html>