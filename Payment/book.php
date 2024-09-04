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

if(isset($_POST['location'], $_POST['slot'], $_POST['timeout'])) {
    $location = filter_var($_POST['location'], FILTER_SANITIZE_STRING);
    $slot = filter_var($_POST['slot'], FILTER_SANITIZE_STRING);
    
    $timeout = json_decode($_POST['timeout'], true);
    $timeoutDays = filter_var($timeout['days'], FILTER_SANITIZE_NUMBER_INT);
    $timeoutHours = filter_var($timeout['hours'], FILTER_SANITIZE_NUMBER_INT);
    $timeoutMinutes = filter_var($timeout['minutes'], FILTER_SANITIZE_NUMBER_INT);
    $timeoutSeconds = filter_var($timeout['seconds'], FILTER_SANITIZE_NUMBER_INT);

    $tableName = strtolower(str_replace(' ', '_', $location));
    $slotColumnName = 'id';
    $statusColumnName = 'status';
    $timeColumnName = 'time';
    $timeoutColumnName = 'timeout';

    $currentDateTime = date('Y-m-d H:i:s');
    $timeoutDateTime = date('Y-m-d H:i:s', strtotime($currentDateTime . " + $timeoutDays days $timeoutHours hours $timeoutMinutes minutes $timeoutSeconds seconds"));

    $sql = "UPDATE $tableName SET $statusColumnName = 'Booked', $timeColumnName = ?, $timeoutColumnName = ? WHERE $slotColumnName = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $currentDateTime, $timeoutDateTime, $slot);

    if($stmt->execute()) {
        echo json_encode(array("success" => true));
    } else {
        echo json_encode(array("success" => false, "error" => "Failed to update database"));
    }
    
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("success" => false, "error" => "Invalid parameters"));
}
?>
