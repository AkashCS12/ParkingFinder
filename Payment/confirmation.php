<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

$config = parse_ini_file('../config.cfg', true);

function generateTransactionId() {
    return 'TX' . uniqid();
}

function getUserData() {
    session_start();
    if (isset($_SESSION['username'], $_SESSION['email'], $_SESSION['phone'])) {
        return array(
            'email' => $_SESSION['email'],
            'username' => $_SESSION['username'],
            'phone' => $_SESSION['phone']
        );
    } else {
        return array('error' => 'User not logged in');
    }
}

function sendConfirmationEmail($to, $transactionId, $slotId, $username, $location) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username   = $config['MAIL']['username'];
        $mail->Password   = $config['MAIL']['password'];
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom($config['MAIL']['setfrom'], 'Parking Finder');
        $mail->addAddress($to);

        $mail->isHTML(true);
        $mail->Subject = 'Parking Slot Booking Confirmation';
        $mail->Body = 'Hello ' . $username . ',<br><br>'
                    . 'Your Parking Slot ' . $slotId . ' at ' . ucwords(str_replace('_', ' ', $location)) . ' has been successfully booked. <br>Transaction ID: ' . $transactionId;

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

$host = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $userData = getUserData();

    if (!isset($userData['error']) && isset($_POST['location']) && isset($_POST['slot'])) {
        $slot = filter_var($_POST['slot'], FILTER_SANITIZE_STRING);
        $location = filter_var($_POST['location'], FILTER_SANITIZE_STRING);

        $tableName = strtolower(str_replace(' ', '_', $location));

        $transactionId = generateTransactionId();

        $sqlUsers = "UPDATE users SET tid = ? WHERE email = ?";
        $stmtUsers = $conn->prepare($sqlUsers);
        $stmtUsers->bind_param("ss", $transactionId, $userData['email']);
        $stmtUsers->execute();
        $stmtUsers->close();

        $timeColumnName = 'time';
        $timeoutColumnName = 'timeout';
        $currentDateTime = date('Y-m-d H:i:s');
        
        $stmt = $conn->prepare("SELECT timeout FROM $tableName WHERE id = ?");
        $stmt->bind_param("i", $slot);
        $stmt->execute();
        $stmt->bind_result($timeoutDateTime);
        $stmt->fetch();
        $stmt->close();
        
        $stmtBookings = $conn->prepare("INSERT INTO bookings (tid, slot, location, $timeColumnName, $timeoutColumnName) VALUES (?, ?, ?, ?, ?)");
        $stmtBookings->bind_param("sssss", $transactionId, $slot, $location, $currentDateTime, $timeoutDateTime);
        $stmtBookings->execute();
        $stmtBookings->close();

        $emailSent = sendConfirmationEmail($userData['email'], $transactionId, $slot, $userData['username'], $location);

        if ($emailSent) {
            echo 'Confirmation email sent successfully!';
        } else {
            echo 'Error sending confirmation email. Please try again later.';
        }
    } else {
        echo json_encode($userData);
    }
} else {
    echo 'Invalid request method.';
}

$conn->close();

?>
