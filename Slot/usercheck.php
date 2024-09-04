<?php
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(array('error' => 'User not logged in'));
    exit;
}

$config = parse_ini_file('../config.cfg', true);

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$database = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$userSessionName = $_SESSION['username'];

$sql = "SELECT tid FROM users WHERE tid IS NOT NULL AND username = '$userSessionName'";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        echo json_encode(array('hasBooking' => true));
    } else {
        echo json_encode(array('hasBooking' => false));
    }
} else {
    echo json_encode(array('error' => 'Error executing SQL query'));
}

$conn->close();
?>
