<?php
$config = parse_ini_file('../config.cfg', true);

$host = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($_POST['location']) && isset($_POST['slot'])) {
    $location = filter_var($_POST['location'], FILTER_SANITIZE_STRING);
    $slot = filter_var($_POST['slot'], FILTER_SANITIZE_STRING);

    $tableName = strtolower(str_replace(' ', '_', $location));
    $slotColumnName = 'id';
    $statusColumnName = 'status';
    $timeColumnName = 'time';
    $timeoutColumnName = 'timeout';

    $currentDateTime = date('Y-m-d H:i:s');

    $sql = "UPDATE $tableName SET $statusColumnName = 'Booked', $timeColumnName = ? WHERE $slotColumnName = ? AND $timeColumnName <= $timeoutColumnName";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $currentDateTime, $slot);
    $stmt->execute();
    $stmt->close();

    $sql = "UPDATE $tableName SET $statusColumnName = 'No Sensor Data', $timeoutColumnName = NULL WHERE $slotColumnName = ? AND $timeColumnName >= $timeoutColumnName";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $slot);
    $stmt->execute();
    $stmt->close();

    echo json_encode(array("success" => true));
    $conn->close();
} else {
    echo json_encode(array("success" => false, "error" => "Invalid parameters"));
}
?>
