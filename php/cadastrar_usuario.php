<?php
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$nome = $data['nome'];
$login = $data['login'];
$senha = password_hash($data['senha'], PASSWORD_DEFAULT); // Hash da senha

$sql = "SELECT id FROM usuarios WHERE login = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(array("status" => "erro", "mensagem" => "Login já existe."));
    $stmt->close();
    $conn->close();
    exit();
}

$sql = "INSERT INTO usuarios (nome, login, senha) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $nome, $login, $senha);

if ($stmt->execute() === TRUE) {
    echo json_encode(array("status" => "sucesso", "mensagem" => "Usuário cadastrado com sucesso."));
} else {
    echo json_encode(array("status" => "erro", "mensagem" => "Erro ao cadastrar usuário: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
