<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');

echo json_encode([
    'success' => true,
    'message' => 'МАЯЧОК: Этот файл точно работает!',
    'timestamp' => time()
], JSON_UNESCAPED_UNICODE);
