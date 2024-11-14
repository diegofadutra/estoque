<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'gerenciamentoestoque';

// Estabelecendo a conexão
$conn = new mysqli($host, $username, $password, $database);

// Verificando a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}

// Definindo o charset para utf8mb4
$conn->set_charset("utf8mb4");
?>
