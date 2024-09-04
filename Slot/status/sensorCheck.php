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

$sql = "SELECT time, status FROM bansal_group_of_institutes WHERE id = 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $lastUpdateTime = strtotime($row["time"]);
    $status = $row["status"];
    $currentTime = time();
    $elapsedTime = $currentTime - $lastUpdateTime;

    if ($elapsedTime > 10 && $status !== "No Sensor Data" && $status !== "Booked") {
$updateSql = "UPDATE bansal_group_of_institutes SET status = 'No Sensor Data' WHERE id = 1 AND status != 'No Sensor Data'";

        if ($conn->query($updateSql) === TRUE) {
            echo "Status updated to 'No Sensor Data'.";
        } else {
            echo "Error updating status: " . $conn->error;
        }
    } else {
        echo "No update needed. Status is already 'No Sensor Data' or elapsed time is not greater than 10 seconds.";
    }
} else {
    echo "Error: No data found.";
}

$conn->close();

?>