<?php
include 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

$sql = "DELETE FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute() === TRUE) {
    echo json_encode(array("status" => "sucesso", "mensagem" => "Usuário excluído com sucesso."));
} else {
    echo json_encode(array("status" => "erro", "mensagem" => "Erro ao excluir usuário: " . $stmt->error));
}

$stmt->close();
$conn->close();
?>
