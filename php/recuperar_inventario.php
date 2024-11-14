<?php
include 'db_connection.php';

// Recuperar dados do inventário
$sql = "SELECT id, nome_produto, quantidade, valor_unitario FROM Inventario WHERE quantidade > 0";
$result = $conn->query($sql);

$itens = array();

if ($result->num_rows > 0) {
    // Output data of each row
    while($row = $result->fetch_assoc()) {
        $itens[] = $row;
    }
}

$conn->close();

echo json_encode($itens);
?>
