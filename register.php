<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = ['success' => false, 'message' => ''];


try {
    
    $pdo = new PDO('mysql:host=localhost;dbname=how_wert;charset=utf8', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $city = $_POST['city'] ?? '';
    $gender = $_POST['gender'] ?? '';
    $age = $_POST['age'] ?? 0;
    $interests = $_POST['interests'] ?? '';
    $about = $_POST['about'] ?? '';

    
    if (empty($username) || empty($email) || empty($password) || empty($city) || empty($gender) || empty($age)) {
        throw new Exception('Заполните все обязательные поля');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Пожалуйста, введите корректный email');
    }

    if (strlen($password) < 6) {
        throw new Exception('Пароль должен содержать минимум 6 символов');
    }

    if ($age < 18 || $age > 99) {
        throw new Exception('Возраст должен быть от 18 до 99 лет');
    }

    
    $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
    $stmt->execute([$username, $email]);
    if ($stmt->fetch()) {
        throw new Exception('Пользователь с таким именем или email уже существует');
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    
    $stmt = $pdo->prepare('INSERT INTO users (username, email, password_hash, city, gender, age, interests, about) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$username, $email, $passwordHash, $city, $gender, $age, $interests, $about]);
    $userId = $pdo->lastInsertId();

    
    $uploadDir = 'uploads/photos/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $photos = [];
    if (isset($_FILES['photos']) && $_FILES['photos']['error'][0] === UPLOAD_ERR_OK) {
        $totalFiles = count($_FILES['photos']['name']);
        for ($i = 0; $i < $totalFiles; $i++) {
            $fileName = uniqid() . '_' . basename($_FILES['photos']['name'][$i]);
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['photos']['tmp_name'][$i], $targetPath)) {
                $photos[] = $fileName;
                // Сохранение пути к фото в БД
                $stmt = $pdo->prepare('INSERT INTO user_photos (user_id, photo_path) VALUES (?, ?)');
                $stmt->execute([$userId, $targetPath]);
            }
        }
    }

    
    $token = bin2hex(random_bytes(32));
    $_SESSION['auth_token'] = $token;

    $response['success'] = true;
    $response['message'] = 'Регистрация успешна!';
    $response['token'] = $token;
    $response['user'] = [
        'id' => $userId,
        'username' => $username,
        'email' => $email,
        'city' => $city,
        'gender' => $gender,
        'age' => $age,
        'interests' => $interests,
        'about' => $about,
        'photos' => $photos
    ];
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>
