<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'db.php';
echo json_encode(["status" => "ok", "message" => "Database connection successful!"]);
?>
