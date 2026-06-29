<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


$host = 'localhost';
$dbname = 'your_database';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=your_database;charset=utf8", 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Ошибка подключения к БД']);
    exit;
}

// Получение данных из запроса
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$city = $input['city'] ?? '';

// Валидация входных данных
if (empty($email) || empty($city)) {
    echo json_encode(['success' => false, 'message' => 'Все поля обязательны для заполнения']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Некорректный email']);
    exit;
}

// Проверка существования пользователя
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Обновление города, если он изменился
    if ($user['city'] !== $city) {
        $updateStmt = $pdo->prepare("UPDATE users SET city = ? WHERE email = ?");
        $updateStmt->execute([$city, $email]);
    }
} else {
    // Регистрация нового пользователя
    $insertStmt = $pdo->prepare("INSERT INTO users (email, city) VALUES (?, ?)");
    $insertStmt->execute([$email, $city]);
}

echo json_encode([
    'success' => true,
    'message' => 'Успешный вход!',
    'user' => ['email' => $email, 'city' => $city]
]);
?>
