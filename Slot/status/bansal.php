<?php

$config = parse_ini_file('../../config.cfg', true);

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["status"])) {
    $status = $_GET["status"];
    $currentTime = date("Y-m-d H:i:s");

    if ($status !== "Booked") {
        $sql = "UPDATE bansal_group_of_institutes SET status = '$status', time = '$currentTime' WHERE id = 1 AND status != 'Booked'";
        if ($conn->query($sql) === TRUE) {
            echo $status;
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Status cannot be updated to 'Booked'.";
    }
} else {
    $sql = "SELECT status FROM bansal_group_of_institutes WHERE id = 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo $row["status"];
        }
    } else {
        echo "unoccupied";
    }
}

$conn->close();

?>
