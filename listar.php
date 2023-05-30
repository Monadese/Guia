<?php
include("config.php");
$sql = "SELECT longitud, latitud, nombre, descripcion, archivo FROM Lugares";
$result = $conn->query($sql);

$data = array(); // Array para almacenar los datos de los lugares

if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $place = array(
      'longitud' => $row['longitud'],
      'latitud' => $row['latitud'],
      'nombre' => $row['nombre'],
      'descripcion' => $row['descripcion'],
      'archivo' => $row['archivo']
    );
    $data[] = $place;
  }
} else {
  echo "0 results";
}

$conn->close();

// Codificar los datos en formato JSON
$jsonData = json_encode($data);

// Imprimir los datos JSON
header('Content-Type: application/json');
echo $jsonData;
?>
