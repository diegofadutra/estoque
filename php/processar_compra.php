<?php
include 'db_connection.php';

// Receber dados enviados do formulário
$data_compra = json_decode(file_get_contents('php://input'), true);

// Iterar sobre os produtos e inserir no banco de dados
foreach ($data_compra['produtos'] as $produto) {
    $stmt = $conn->prepare("INSERT INTO Inventario (nome_produto, quantidade, valor_unitario, valor_total) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sidd", $produto['nome'], $produto['quantidade'], $produto['valor'], $produto['valorTotal']);
    
    if ($stmt->execute() === TRUE) {
        echo "Novo produto cadastrado com sucesso!";
    } else {
        echo "Erro: " . $stmt->error;
    }
    $stmt->close();
}

$conn->close();
?>
