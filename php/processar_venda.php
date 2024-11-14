<?php
include 'db_connection.php';

// Receber dados enviados do formulário
$data_venda = json_decode(file_get_contents('php://input'), true);

$erro = false; // Variável para rastrear se houve algum erro
$mensagens = []; // Array para armazenar mensagens de depuração

$mensagens[] = "Recebendo dados da venda: " . json_encode($data_venda);

// Iterar sobre os itens vendidos e atualizar o inventário
foreach ($data_venda['itens'] as $item) {
    $mensagens[] = "Atualizando item: " . json_encode($item);
    
    // Diminuir a quantidade do produto no inventário
    $stmt = $conn->prepare("UPDATE Inventario SET quantidade = quantidade - ? WHERE id = ?");
    $stmt->bind_param("ii", $item['quantidade'], $item['id']);

    if ($stmt->execute() === TRUE) {
        $mensagens[] = "Atualização bem-sucedida para o item com ID: " . $item['id'];
        
        // Verificar se a quantidade chegou a zero e excluir o item se necessário
        $stmtCheck = $conn->prepare("SELECT quantidade FROM Inventario WHERE id = ?");
        $stmtCheck->bind_param("i", $item['id']);
        $stmtCheck->execute();
        $stmtCheck->bind_result($quantidade);
        $stmtCheck->fetch();
        $stmtCheck->close();

        if ($quantidade <= 0) {
            $mensagens[] = "Quantidade zero ou negativa para o item com ID: " . $item['id'] . ". Excluindo item.";
            $stmtDelete = $conn->prepare("DELETE FROM Inventario WHERE id = ?");
            $stmtDelete->bind_param("i", $item['id']);
            $stmtDelete->execute();
            $stmtDelete->close();
        }
    } else {
        $erro = true;
        $mensagens[] = "Erro ao atualizar o item: " . $stmt->error;
        break; // Interrompe o loop em caso de erro
    }
    $stmt->close();
}

$conn->close();

if ($erro) {
    http_response_code(500);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Erro ao processar venda.', 'detalhes' => $mensagens]);
} else {
    http_response_code(200);
    echo json_encode(['status' => 'sucesso', 'mensagem' => 'Venda processada com sucesso.', 'detalhes' => $mensagens]);
}
?>
