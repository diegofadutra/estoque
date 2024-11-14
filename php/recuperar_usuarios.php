<?php
include 'db_connection.php';

header('Content-Type: application/json');

$sql = "SELECT id, nome, login FROM usuarios";
$result = $conn->query($sql);

$usuarios = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }
}

echo json_encode($usuarios);

$conn->close();
?>
