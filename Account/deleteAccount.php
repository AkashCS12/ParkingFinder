<?php
session_start();

if (isset($_SESSION['username'])) {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $password = $_POST['password'];

        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "parkingfinder";        

        $conn = new mysqli($servername, $username, $password_db, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        if ($password === $_SESSION['password']) {
            $stmt = $conn->prepare("DELETE FROM users WHERE username = ?");
            $stmt->bind_param("s", $_SESSION['username']);
            $stmt->execute();
            $stmt->close();

            session_unset();
            session_destroy();

            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('error' => 'Incorrect password.'));
        }

        $conn->close();
    } else {
        echo json_encode(array('error' => 'Invalid request method.'));
    }
} else {
    echo json_encode(array('error' => 'User not logged in'));
}
?>
