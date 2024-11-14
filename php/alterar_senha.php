<?php
include 'db_connection.php';

session_start();

// Recebe e valida os dados
$data = json_decode(file_get_contents('php://input'), true);
$login = $data['login'];
$senhaAtual = $data['senhaAtual'];
$novaSenha = $data['novaSenha'];

// Verifica o usuário
$sql = "SELECT senha FROM usuarios WHERE login = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(array("status" => "erro", "mensagem" => "Usuário não encontrado."));
    $stmt->close();
    $conn->close();
    exit();
}

$user = $result->fetch_assoc();
$stmt->close();

// Verifica a senha atual
if (!password_verify($senhaAtual, $user['senha'])) {
    echo json_encode(array("status" => "erro", "mensagem" => "Senha atual incorreta."));
    $conn->close();
    exit();
}

// Atualiza a senha
$novaSenhaHash = password_hash($novaSenha, PASSWORD_DEFAULT);
$sql = "UPDATE usuarios SET senha = ? WHERE login = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $novaSenhaHash, $login);

if ($stmt->execute() === TRUE) {
    echo json_encode(array("status" => "sucesso", "mensagem" => "Senha alterada com sucesso."));
} else {
    echo json_encode(array("status" => "erro", "mensagem" => "Erro ao alterar senha: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
