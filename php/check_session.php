<?php
session_start();

$response = array();

if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
    $response['status'] = 'valido';
    $response['usuario'] = $_SESSION['username'];
    $response['login'] = $_SESSION['login']; // Adicionar login à resposta
} else {
    $response['status'] = 'invalido';
}

echo json_encode($response);
?>
