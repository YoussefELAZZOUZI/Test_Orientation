<?php
require 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data)) {
    echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
    exit;
}

// Compter les réponses par type
$counts = ['A' => 0, 'B' => 0, 'C' => 0, 'D' => 0];

foreach ($data as $answerType) {
    if (isset($counts[$answerType])) {
        $counts[$answerType]++;
    }
}

// Trouver le profil dominant
$profil_type = array_search(max($counts), $counts);

$stmt = $pdo->prepare("SELECT * FROM profils WHERE type = ?");
$stmt->execute([$profil_type]);
$profil = $stmt->fetch(PDO::FETCH_ASSOC);

if ($profil) {
    echo json_encode([
        'nom' => $profil['nom'],
        'description' => $profil['description'],
        'secturs' => $profil['secturs'],
        'duree' => $profil['duree'],
        'ecoles' => $profil['ecoles'],
        'avis' => $profil['avis']
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Profil non trouvé']);
}
?>
