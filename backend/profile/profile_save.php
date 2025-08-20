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

header('Content-Type: application/json');

require __DIR__ . '/../config/db.php';
require __DIR__ . '/../utils/auth.php';

$uid = require_user_id();

// Parse JSON payload
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Whitelist fields that exist in Profile table
$fields = [
    'name', 'title', 'company', 'location', 'experience',
    'profile_picture_url', 'phone', 'linkedin_url',
    'professional_bio', 'areas_of_interest',
    'courses_enrolled', 'certificates_earned', 'study_hours'
];

$data = [];
foreach ($fields as $f) {
    $data[$f] = $input[$f] ?? null;
}

// Cast numeric counters
foreach (['courses_enrolled', 'certificates_earned', 'study_hours'] as $n) {
    if ($data[$n] !== null && $data[$n] !== '') $data[$n] = (int)$data[$n];
    if ($data[$n] === '') $data[$n] = null;
}

// Upsert Profile (create if missing, update if exists)
$sql = "
INSERT INTO Profile (
  user_id, name, title, company, location, experience,
  profile_picture_url, phone, linkedin_url, professional_bio, areas_of_interest,
  courses_enrolled, certificates_earned, study_hours
) VALUES (
  :uid, :name, :title, :company, :location, :experience,
  :profile_picture_url, :phone, :linkedin_url, :professional_bio, :areas_of_interest,
  :courses_enrolled, :certificates_earned, :study_hours
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  title = VALUES(title),
  company = VALUES(company),
  location = VALUES(location),
  experience = VALUES(experience),
  profile_picture_url = VALUES(profile_picture_url),
  phone = VALUES(phone),
  linkedin_url = VALUES(linkedin_url),
  professional_bio = VALUES(professional_bio),
  areas_of_interest = VALUES(areas_of_interest),
  courses_enrolled = VALUES(courses_enrolled),
  certificates_earned = VALUES(certificates_earned),
  study_hours = VALUES(study_hours),
  updated_at = CURRENT_TIMESTAMP;
";

$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':uid' => $uid,
    ':name' => $data['name'],
    ':title' => $data['title'],
    ':company' => $data['company'],
    ':location' => $data['location'],
    ':experience' => $data['experience'],
    ':profile_picture_url' => $data['profile_picture_url'],
    ':phone' => $data['phone'],
    ':linkedin_url' => $data['linkedin_url'],
    ':professional_bio' => $data['professional_bio'],
    ':areas_of_interest' => $data['areas_of_interest'],
    ':courses_enrolled' => $data['courses_enrolled'],
    ':certificates_earned' => $data['certificates_earned'],
    ':study_hours' => $data['study_hours'],
]);

// Re-read and return combined user + profile (same shape as profile_get.php)
$sql = "
SELECT 
  u.id AS user_id, u.username, u.email, u.is_verified, u.created_at,
  p.user_id AS p_user_id,
  p.name, p.title, p.company, p.location, p.experience,
  p.profile_picture_url, p.phone, p.linkedin_url, 
  p.professional_bio, p.areas_of_interest,
  p.courses_enrolled, p.certificates_earned, p.study_hours,
  p.created_at AS profile_created_at, p.updated_at AS profile_updated_at
FROM users u
LEFT JOIN Profile p ON p.user_id = u.id
WHERE u.id = :uid
LIMIT 1;
";
$stmt = $pdo->prepare($sql);
$stmt->execute([':uid' => $uid]);
$row = $stmt->fetch();

if (!$row) {
    // This should not happen if the user exists
    echo json_encode(['ok' => true, 'user' => ['id' => $uid], 'has_profile' => false, 'profile' => null]);
    exit;
}

$has_profile = !is_null($row['p_user_id']);

echo json_encode([
    'ok' => true,
    'user' => [
        'id'          => (int)$row['user_id'],
        'username'    => $row['username'],
        'email'       => $row['email'],
        'is_verified' => (int)$row['is_verified'],
        'created_at'  => $row['created_at'],
    ],
    'has_profile' => $has_profile,
    'profile' => $has_profile ? [
        'name'                => $row['name'],
        'title'               => $row['title'],
        'company'             => $row['company'],
        'location'            => $row['location'],
        'experience'          => $row['experience'],
        'profile_picture_url' => $row['profile_picture_url'],
        'phone'               => $row['phone'],
        'linkedin_url'        => $row['linkedin_url'],
        'professional_bio'    => $row['professional_bio'],
        'areas_of_interest'   => $row['areas_of_interest'],
        'courses_enrolled'    => isset($row['courses_enrolled']) ? (int)$row['courses_enrolled'] : 0,
        'certificates_earned' => isset($row['certificates_earned']) ? (int)$row['certificates_earned'] : 0,
        'study_hours'         => isset($row['study_hours']) ? (int)$row['study_hours'] : 0,
        'created_at'          => $row['profile_created_at'],
        'updated_at'          => $row['profile_updated_at'],
    ] : null
]);
