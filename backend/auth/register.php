<?php
// ---------- CORS ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = [
    'http://localhost:3000',  // Next.js dev
    'http://localhost:5173',  // Vite dev
    'https://etraincon.com',  // Production
];

if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Vary: Origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Always return JSON
header('Content-Type: application/json');

// ---------- App bootstrap ----------
session_start();

// The path must go up ONE level to find db.php from the config folder
require __DIR__ . '/../config/db.php';

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// The path must go up ONE level and then into the 'email' folder
require __DIR__ . '/../email/Exception.php';
require __DIR__ . '/../email/PHPMailer.php';
require __DIR__ . '/../email/SMTP.php';

// Utility: read body (JSON or form)
function get_input(): array {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
    // Fallback to form-encoded
    return $_POST ?? [];
}

// Only POST is allowed for this endpoint
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed.']);
    exit;
}

$in = get_input();

// ---------- Input sanitization ----------
$username_raw = trim($in['username'] ?? '');
$email_raw    = trim($in['email'] ?? '');
$password_raw = trim($in['password'] ?? '');

// FILTER_SANITIZE_STRING is deprecated in PHP 8.1+, so we’ll do a conservative sanitize:
$username = strip_tags($username_raw);
$email    = filter_var($email_raw, FILTER_SANITIZE_EMAIL);
$password = $password_raw; // keep raw for hashing; just trim above

// ---------- Validation ----------
if ($username === '' || $email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Please fill in all fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email format.']);
    exit;
}

if (strlen($username) < 3 || strlen($username) > 50) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Username must be between 3 and 50 characters.']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Password must be at least 6 characters long.']);
    exit;
}

// ---------- Check duplicate email ----------
try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['ok' => false, 'error' => 'This email address is already registered.']);
        exit;
    }
} catch (PDOException $e) {
    error_log("Registration email-check error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database error. Please try again.']);
    exit;
}

// ---------- Create user ----------
$hashed_password   = password_hash($password, PASSWORD_DEFAULT);
$verification_token = bin2hex(random_bytes(50));

try {
    $sql = "INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username, $email, $hashed_password, $verification_token]);
} catch (PDOException $e) {
    error_log("Registration insert error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database error. Please try again.']);
    exit;
}

// ---------- Send verification email ----------
$verification_link = SITE_URL . "/api/verify.php?token=" . $verification_token;

$mail = new PHPMailer(true);
try {
    // Server settings from db_config.php
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->Port       = SMTP_PORT;

    // Recipients
    $mail->setFrom(EMAIL_FROM, APP_NAME);
    $mail->addAddress($email, $username);

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Verify Your Email Address for ' . APP_NAME;
    $mail->Body    = "<h2>Thank you for registering!</h2>
                      <p>Please click the link below to activate your account:</p>
                      <p><a href='{$verification_link}' style='padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;'>Verify My Email</a></p>
                      <p>If you cannot click the link, copy and paste this into your browser:</p>
                      <p>{$verification_link}</p>";
    $mail->AltBody = "To verify your email, copy and paste this link into your browser: {$verification_link}";

    $mail->send();

    http_response_code(200);
    echo json_encode([
        'ok' => true,
        'message' => 'Registration successful! Please check your email to activate your account.'
    ]);
    exit;
} catch (Exception $e) {
    // Email failed, but user is created. You may choose to delete user on failure if desired.
    error_log("Mailer error: " . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'error' => 'Registration succeeded, but verification email could not be sent.'
    ]);
    exit;
}
