<?php
$servername = "143.198.114.252";
$username = "u217340";
$password = "1912592";
$dbname = "u217340";

// Create connection
if ($conn->connect_error) {
  die("Error de conexión a la base de datos: " . $conn->connect_error);
} else {
  echo "Conexión exitosa a la base de datos";
}

$conn->close();
?>