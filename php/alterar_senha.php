<?php
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$login = $data['login'];
$senhaAtual = $data['senhaAtual'];
$novaSenha = $data['novaSenha']; // Senha sem criptografia

$sql = "SELECT senha FROM usuarios WHERE login = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if ($senhaAtual !== $user['senha']) {
        echo json_encode(array("status" => "erro", "mensagem" => "Senha atual incorreta."));
        $stmt->close();
        $conn->close();
        exit();
    }
} else {
    echo json_encode(array("status" => "erro", "mensagem" => "Usuário não encontrado."));
    $stmt->close();
    $conn->close();
    exit();
}

// Atualizar a senha
$sql = "UPDATE usuarios SET senha = ? WHERE login = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $novaSenha, $login);

if ($stmt->execute() === TRUE) {
    echo json_encode(array("status" => "sucesso", "mensagem" => "Senha alterada com sucesso."));
} else {
    echo json_encode(array("status" => "erro", "mensagem" => "Erro ao alterar senha: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
