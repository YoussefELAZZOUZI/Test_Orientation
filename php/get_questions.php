<?php
require 'db.php';
header('Content-Type: application/json');

try {
    $stmt = $pdo->query("SELECT id, question_text FROM questions");
    $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($questions as &$question) {
        $stmt2 = $pdo->prepare("SELECT id, reponse_text, type FROM reponses WHERE question_id = ?");
        $stmt2->execute([$question['id']]);
        $question['answers'] = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($questions);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>