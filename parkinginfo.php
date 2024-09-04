<?php

$config = parse_ini_file('config.cfg', true);

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$location = $_GET['location'];

$tableName = str_replace(' ', '_', strtolower($location));

$sqlTotal = "SELECT COUNT(*) AS total_slots FROM $tableName";

$resultTotal = $conn->query($sqlTotal);

if ($resultTotal->num_rows > 0) {
    $rowTotal = $resultTotal->fetch_assoc();
    $totalSlots = $rowTotal["total_slots"];
} else {
    $totalSlots = 0;
}

$sqlAvailable = "SELECT COUNT(*) AS available_slots FROM $tableName WHERE status = 'unoccupied'";

$resultAvailable = $conn->query($sqlAvailable);

if ($resultAvailable->num_rows > 0) {
    $rowAvailable = $resultAvailable->fetch_assoc();
    $availableSlots = $rowAvailable["available_slots"];
} else {
    $availableSlots = 0;
}

$conn->close();

echo $totalSlots . "," . $availableSlots;
?>
