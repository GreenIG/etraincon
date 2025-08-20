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


// Securely include the database configuration
require __DIR__ . '/../config/db.php';

$message = '';
$error = '';
$token = $_GET['token'] ?? '';
$show_form = false;

// FOR DEBUGGING: Uncomment these lines if you get a 500 error
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

if (empty($token)) {
    $error = "No reset token provided. Please check your link.";
} else {
    // Check if the token is valid and not expired
    $stmt = $pdo->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Token is valid, show the password reset form
        $show_form = true;
    } else {
        // Token is invalid or has expired
        $error = "This password reset link is invalid or has expired. Please request a new one.";
    }
}

// Handle the form submission when the user enters a new password
if ($_SERVER["REQUEST_METHOD"] == "POST" && $show_form) {
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];

    if (empty($password) || empty($confirm_password)) {
        $error = "Please fill in both password fields.";
    } elseif ($password !== $confirm_password) {
        $error = "The passwords do not match. Please try again.";
    } elseif (strlen($password) < 8) {
        $error = "Password must be at least 8 characters long.";
    } else {
        // All checks passed, update the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // Update the user's password and set the reset token to NULL so it can't be used again
        $update_stmt = $pdo->prepare("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?");
        
        if ($update_stmt->execute([$hashed_password, $user['id']])) {
            $message = "Your password has been reset successfully! You can now log in with your new password.";
            $show_form = false; // Hide the form after successful update
        } else {
            $error = "An unexpected error occurred. Please try again.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password - <?= isset($APP_NAME) ? $APP_NAME : 'Etraincon' ?></title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; background-color: #f4f4f9; }
        .container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        form { display: flex; flex-direction: column; gap: 15px; }
        input { padding: 10px; border-radius: 5px; border: 1px solid #ddd; }
        button { padding: 12px; background-color: #007bff; color: white; border: none; cursor: pointer; border-radius: 5px; font-size: 16px; }
        .message { padding: 15px; margin-bottom: 20px; border-radius: 5px; }
        .message.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .message.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Reset Your Password</h2>

        <?php if (!empty($message)): ?>
            <div class="message success"><?= htmlspecialchars($message) ?></div>
            <p><a href="login.php">Proceed to Login</a></p>
        <?php endif; ?>

        <?php if (!empty($error)): ?>
            <div class="message error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <?php if ($show_form): ?>
            <p>Please enter your new password below.</p>
            <form action="reset_password.php?token=<?= htmlspecialchars($token) ?>" method="post">
                <label for="password">New Password:</label>
                <input type="password" id="password" name="password" required>
                
                <label for="confirm_password">Confirm New Password:</label>
                <input type="password" id="confirm_password" name="confirm_password" required>
                
                <button type="submit">Reset Password</button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>