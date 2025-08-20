<?php

header("Access-Control-Allow-Origin: *"); // or your exact domain
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Use your existing DB connection (must set $pdo)
require __DIR__ . '/../config/db.php';
if (!isset($pdo)) {
    echo json_encode(["status" => "error", "message" => "DB connection not initialized."]);
    exit;
}

// ---- Helpers ----
function normalize_options_with_labels(array $options): array {
    $letters = range('A', 'Z');
    $out = [];
    foreach ($options as $i => $opt) {
        $clean = preg_replace('/^\s*[A-Za-z]\s*[\.\)\-]\s*/', '', (string)$opt);
        $out[] = $letters[$i] . '. ' . $clean;
    }
    return $out;
}

// ---- Read course_id ----
$course_id = isset($_POST['course_id'])
    ? intval($_POST['course_id'])
    : (isset($_GET['course_id']) ? intval($_GET['course_id']) : 0);

if ($course_id <= 0) {
    echo json_encode(["status" => "error", "message" => "Missing or invalid course_id"]);
    exit;
}

// ---- Fetch course file path ----
try {
    $stmt = $pdo->prepare("SELECT file_path FROM courses WHERE id = ?");
    $stmt->execute([$course_id]);
    $course = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$course) {
        echo json_encode(["status" => "error", "message" => "Course not found"]);
        exit;
    }
} catch (Throwable $e) {
    echo json_encode(["status" => "error", "message" => "DB error fetching course: " . $e->getMessage()]);
    exit;
}

$file_path = ltrim($course['file_path'], '/');
$pdf_path  = "/home/etrainae/public_html/" . $file_path;

if (!file_exists($pdf_path)) {
    echo json_encode(["status" => "error", "message" => "PDF file not found: " . $pdf_path]);
    exit;
}

// ---- Call ML API ----
$ml_api_url = "https://bereket12445-my-quiz-api.hf.space/generate-quiz/";
$post_fields = [
    'pdf_file'        => new CURLFile($pdf_path, 'application/pdf', basename($pdf_path)),
    'num_mcq'         => 5,
    'num_open_ended'  => 5,
    'model_name'      => 'gemini-1.5-flash-latest',
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $ml_api_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(["status" => "error", "message" => "ML API request failed", "error" => curl_error($ch)]);
    exit;
}
curl_close($ch);

$quiz_data = json_decode($response, true);
if (!$quiz_data || !isset($quiz_data['multiple_choice']) || !isset($quiz_data['open_ended'])) {
    echo json_encode([
        "status"  => "error",
        "message" => "Invalid quiz data from ML API",
        "raw"     => $quiz_data
    ]);
    exit;
}

// ---- Insert quizzes ----
$inserted_count = 0;
$mcq_count = is_array($quiz_data['multiple_choice']) ? count($quiz_data['multiple_choice']) : 0;
$open_count = is_array($quiz_data['open_ended']) ? count($quiz_data['open_ended']) : 0;

// Save the last inserted ID before adding new quizzes
$last_id_before = $pdo->query("SELECT MAX(id) FROM quizzes")->fetchColumn();

try {
    $pdo->beginTransaction();

    // Insert MCQs
    if ($mcq_count > 0) {
        $ins_mcq = $pdo->prepare("
            INSERT INTO quizzes (course_id, question_type, question, options, correct_answer, explanation, created_at)
            VALUES (?, 'multiple_choice', ?, ?, ?, ?, NOW())
        ");
        foreach ($quiz_data['multiple_choice'] as $mcq) {
            $ins_mcq->execute([
                $course_id,
                $mcq['question'] ?? '',
                json_encode($mcq['options'] ?? [], JSON_UNESCAPED_UNICODE),
                $mcq['correct_answer'] ?? null,
                $mcq['explanation'] ?? null
            ]);
            $inserted_count++;
        }
    }

    // Insert Open-ended
    if ($open_count > 0) {
        $ins_open = $pdo->prepare("
            INSERT INTO quizzes (course_id, question_type, question, correct_answer, created_at)
            VALUES (?, 'open_ended', ?, ?, NOW())
        ");
        foreach ($quiz_data['open_ended'] as $q) {
            $ins_open->execute([
                $course_id,
                $q['question'] ?? '',
                $q['answer'] ?? null
            ]);
            $inserted_count++;
        }
    }

    $pdo->commit();
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => "DB insert failed: " . $e->getMessage()]);
    exit;
}

// ---- Fetch ONLY newly inserted quizzes ----
try {
    $stmt = $pdo->prepare("
        SELECT id, question_type, question, options
        FROM quizzes
        WHERE course_id = ? AND id > ?
        ORDER BY id ASC
    ");
    $stmt->execute([$course_id, $last_id_before]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $quizzes = [];
    foreach ($rows as $r) {
        if ($r['question_type'] === 'multiple_choice') {
            $opts = [];
            if (!empty($r['options'])) {
                $decoded = json_decode($r['options'], true);
                if (is_array($decoded)) {
                    $opts = normalize_options_with_labels($decoded);
                }
            }
            $quizzes[] = [
                "question_type" => "multiple_choice",
                "question"      => $r['question'],
                "options"       => $opts
            ];
        } else {
            $quizzes[] = [
                "question_type" => "open_ended",
                "question"      => $r['question']
            ];
        }
    }

    echo json_encode([
        "status"    => "success",
        "course_id" => $course_id,
        "counts"    => ["multiple_choice" => $mcq_count, "open_ended" => $open_count],
        "quizzes"   => $quizzes
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    echo json_encode(["status" => "error", "message" => "DB fetch failed: " . $e->getMessage()]);
    exit;
}
