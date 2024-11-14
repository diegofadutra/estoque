<?php
session_start();
session_unset();
session_destroy();

$response = array("status" => "sucesso", "mensagem" => "Logout realizado com sucesso.");
echo json_encode($response);
?>
