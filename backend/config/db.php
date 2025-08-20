<?php
$host = "localhost";
$dbname = "etrainae_my_quizdb";
$username = "etrainae_my_quizdb";
$password = "925BAMtam@@@";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode([
        "status" => "error",
        "message" => "DB connection failed: " . $e->getMessage()
    ]));
}
?>
