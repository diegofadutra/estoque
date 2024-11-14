<?php
include 'db_connection.php';

session_start();

function send_json_response($status, $mensagem, $usuario = null) {
    echo json_encode(["status" => $status, "mensagem" => $mensagem, "usuario" => $usuario]);
    exit;
}

// Recebe e valida os dados
$data = json_decode(file_get_contents('php://input'), true);
$username = isset($data['username']) ? trim($data['username']) : '';
$password = isset($data['password']) ? $data['password'] : '';

if (empty($username) || empty($password)) {
    send_json_response("erro", "Usuário e senha são obrigatórios.");
}

// Verifica conexão com o banco
if ($conn->connect_error) {
    send_json_response("erro", "Erro na conexão com o banco de dados: " . $conn->connect_error);
}

// Consulta o usuário
$sql = "SELECT id, nome, login, senha, status FROM usuarios WHERE login = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    send_json_response("erro", "Erro na preparação da consulta: " . $conn->error);
}
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    send_json_response("erro", "Usuário não encontrado.");
}

$user = $result->fetch_assoc();

// Verifica o status do usuário
if ($user['status'] !== 'ativo') {
    send_json_response("erro", "Usuário inativo.");
}

// Verifica a senha
if (password_verify($password, $user['senha'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['username'] = $user['nome'];
    send_json_response("sucesso", "Login realizado com sucesso! Redirecionando...", $user['nome']);
} else {
    send_json_response("erro", "Senha incorreta.");
}

$stmt->close();
$conn->close();
?>
