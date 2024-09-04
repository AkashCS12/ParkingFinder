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

$timeout_duration = 5;

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["status"])) {
    $status = $_GET["status"];

    $sql_update_timestamp = "UPDATE parking_slots SET last_update = NOW() WHERE id = 1";
    if ($conn->query($sql_update_timestamp) !== TRUE) {
        echo "Error updating last update timestamp: " . $conn->error;
        exit;
    }

    $sql_check_bansal_status = "SELECT status FROM bansal_group_of_institutes WHERE id = 1";
    $result_bansal_status = $conn->query($sql_check_bansal_status);
    if ($result_bansal_status->num_rows > 0) {
        $row_bansal_status = $result_bansal_status->fetch_assoc();
        if ($row_bansal_status["status"] === "Booked") {
            echo "Booked";
            exit;
        }
    }

    $sql_update_status = "UPDATE parking_slots SET status = '$status' WHERE id = 1";
    if ($conn->query($sql_update_status) === TRUE) {
        $sql_update_bansal = "UPDATE bansal_group_of_institutes SET status = '$status' WHERE id = 1";
        if ($conn->query($sql_update_bansal) !== TRUE) {
            echo "Error updating bansal_group_of_institutes table: " . $conn->error;
            exit;
        }
        echo $status;
    } else {
        echo "Error updating parking_slots table: " . $conn->error;
    }
} else {
    $sql_check_timestamp = "SELECT last_update FROM parking_slots WHERE id = 1";
    $result_timestamp = $conn->query($sql_check_timestamp);

    if ($result_timestamp->num_rows > 0) {
        $row_timestamp = $result_timestamp->fetch_assoc();
        $last_update_timestamp = strtotime($row_timestamp["last_update"]);

        $current_timestamp = time();
        $time_difference = $current_timestamp - $last_update_timestamp;

        if ($time_difference > $timeout_duration) {
            $sql_set_no_sensor_data = "UPDATE parking_slots SET status = 'No Sensor Data' WHERE id = 1";
            if ($conn->query($sql_set_no_sensor_data) === TRUE) {
                $sql_update_bansal = "UPDATE bansal_group_of_institutes SET status = 'No Sensor Data' WHERE id = 1";
                if ($conn->query($sql_update_bansal) !== TRUE) {
                    echo "Error updating bansal_group_of_institutes table: " . $conn->error;
                    exit;
                }
                echo "No Sensor Data";
            } else {
                echo "Error updating parking_slots table: " . $conn->error;
            }
        } else {
            $sql_check_status = "SELECT status FROM parking_slots WHERE id = 1";
            $result_status = $conn->query($sql_check_status);

            if ($result_status->num_rows > 0) {
                $row_status = $result_status->fetch_assoc();
                echo $row_status["status"];
            } else {
                echo "unoccupied";
            }
        }
    } else {
        echo "Error: Last update timestamp not found";
    }
}

$conn->close();

?>
