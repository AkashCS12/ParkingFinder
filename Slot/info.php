<?php

$config = parse_ini_file('../config.cfg', true);

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$database = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if(isset($_GET['location'])) {
    $clicked_location = $_GET['location'];

    $table_name = str_replace(' ', '_', strtolower($clicked_location));
    $sql = "SELECT * FROM $table_name";
    $result = $conn->query($sql);

    if ($result) {
        $slots = [];
        while($row = $result->fetch_assoc()) {
            $slots[] = [
                'id' => $row['id'],
                'status' => $row['status']
            ];
        }
        echo json_encode(['location' => $clicked_location, 'slots' => $slots]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch parking slot information']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Location parameter is missing']);
}

$conn->close();
?>
