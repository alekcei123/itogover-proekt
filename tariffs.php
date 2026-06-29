<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');


$host = 'localhost';
$dbname = 'how_saer';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=how_saer;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM tariffs WHERE is_active = 1 ORDER BY price");
    $stmt->execute();
    $tariffs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Преобразуем JSON-строку features обратно в массив
    foreach ($tariffs as &$tariff) {
        $tariff['features'] = json_decode($tariff['features'], true);
    }

    $response = [
        'success' => true,
        'data' => $tariffs,
        'count' => count($tariffs),
        'timestamp' => date('c')
    ];
} catch (PDOException $e) {
    $response = [
        'success' => false,
        'message' => 'Ошибка базы данных: ' . $e->getMessage()
    ];
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>


