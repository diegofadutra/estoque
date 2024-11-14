<?php
include 'php/db_connection.php';

try {
    // Recuperar dados do inventário
    $sql = "SELECT id, nome_produto, quantidade, valor_unitario FROM Inventario WHERE quantidade > 0";
    $result = $conn->query($sql);

    $itens = array();

    if ($result->num_rows > 0) {
        // Output data of each row
        while ($row = $result->fetch_assoc()) {
            $itens[] = $row;
        }
    }

    // Fechar a conexão
    $conn->close();

    // Enviar os dados como JSON
    echo json_encode($itens);

} catch (Exception $e) {
    // Se ocorrer um erro, feche a conexão e envie uma mensagem de erro
    $conn->close();
    http_response_code(500);
    echo json_encode(array('status' => 'erro', 'mensagem' => 'Erro ao recuperar o inventário: ' . $e->getMessage()));
}
?>
