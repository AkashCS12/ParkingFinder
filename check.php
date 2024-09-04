<?php

$config = parse_ini_file('config.cfg', true);

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($conn->query("CREATE DATABASE IF NOT EXISTS $dbname") === TRUE) {
    echo "Database created successfully";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

$conn->select_db("$dbname");

$users_table_sql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    tid VARCHAR(30) NULL DEFAULT NULL
)";

if ($conn->query($users_table_sql) === TRUE) {
    echo "Table 'users' created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

$booking_table_sql = "CREATE TABLE IF NOT EXISTS bookings (
    tid VARCHAR(30) NOT NULL,
    location VARCHAR(50) NULL DEFAULT NULL,
    slot INT(11) NULL DEFAULT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timeout TIMESTAMP NULL DEFAULT NULL
)";

if ($conn->query($booking_table_sql) === TRUE) {
    echo "Table 'bookings' created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

$parking_slots_table_sql = "CREATE TABLE IF NOT EXISTS parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30)
)";

if ($conn->query($parking_slots_table_sql) === TRUE) {
    echo "Table 'parking_slots' created successfully<br>";
} else {
    echo "Error creating table: " . $conn->error . "<br>";
}

$check_default_entry_sql = "SELECT * FROM parking_slots WHERE id = 1";
$result = $conn->query($check_default_entry_sql);

if ($result->num_rows == 0) {
    $insert_default_entry_sql = "INSERT INTO parking_slots (id, status) VALUES (1, 'occupied')";
    if ($conn->query($insert_default_entry_sql) === TRUE) {
        echo "Default entry inserted successfully<br>";
    } else {
        echo "Error inserting default entry: " . $conn->error . "<br>";
    }
}

$conn->close();

?>
