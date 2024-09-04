<?php

$config = parse_ini_file('../config.cfg', true);

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully\n";
} else {
    echo "Error creating database: " . $conn->error . "\n";
}

$conn->select_db("$dbname");

$locations = [
    "Minal Mall Parking Lot",
    "VEER VALET PARKING",
    "Parking MPSEDC",
    "Smart Parking Bhopal",
    "Parking Area",
    "bp Parking Lot",
    "Parking Lot",
    "Parking",
    "Smart Parking 1B",
    "Parking Multilevel",
    "Parking Areas",
    "J P Hospital parking",
    "Multi level parking",
    "Parking For 4 Wheeler",
    "Smart Parking DB City Bhopal",
    "BHEL Senior Club Parking",
    "Multi Level Parking ISBT",
    "Krishna Complex Parking Lot",
    "Parking Ashoka Lake view",
    "Tatya Tope Multi Level parking",
    "Rani kamlapati railway station parking",
    "Natraj Club Parking",
    "Lake View Parking",
    "Bansal Group of Institutes",
    "Test Location"
];

foreach ($locations as $location) {
    $table_name = str_replace(' ', '_', strtolower($location));
    $sql_check_table = "SHOW TABLES LIKE '$table_name'";
    $result = $conn->query($sql_check_table);
    
    if ($result->num_rows == 0) {
        $sql_create_table = "CREATE TABLE $table_name (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            status VARCHAR(30) NOT NULL DEFAULT 'No Sensor Data',
            time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            timeout TIMESTAMP NULL DEFAULT NULL
        )";
        if ($conn->query($sql_create_table) === TRUE) {
            echo "Table $table_name created successfully\n";
            for ($i = 1; $i <= 6; $i++) {
                $sql_insert = "INSERT INTO $table_name (status) VALUES ('No Sensor Data')";
                if ($conn->query($sql_insert) === TRUE) {
                    echo "Inserted row $i for $location\n";
                } else {
                    echo "Error inserting row: " . $conn->error . "\n";
                }
            }
        } else {
            echo "Error creating table: " . $conn->error . "\n";
        }
    } else {
        echo "Table $table_name already exists\n";
    }
}
