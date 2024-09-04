<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

session_start();

$config = parse_ini_file('../config.cfg', true);

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usernameOrEmail = $_POST["usernameOrEmail"];
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?");
    $stmt->bind_param("sss", $usernameOrEmail, $usernameOrEmail, $password);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        setcookie("loggedIn", "true", time() + (86400 * 30), "/");
        $row = $result->fetch_assoc();
        $_SESSION['username'] = $row['username'];
        $_SESSION['email'] = $row['email'];
        $_SESSION['phone'] = $row['phone'];
        $_SESSION['password'] = $row['password'];

        echo "success";
    } else {
        echo "failure";
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["checkEmail"])) {
    $email = $_GET["email"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        echo "found";
    } else {
        echo "not_found";
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["sendOTP"])) {
    $email = $_GET["email"];

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $otp = rand(100000, 999999);

        $_SESSION['otp'] = $otp;

        $mail = new PHPMailer;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username   = $config['MAIL']['username'];
        $mail->Password   = $config['MAIL']['password'];
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom($config['MAIL']['setfrom'], 'Parking Finder');
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset OTP';
        $mail->Body    = 'Your OTP for password reset is: ' . $otp;

        if(!$mail->send()) {
            echo 'error';
        } else {
            echo $otp;
        }
    } else {
        echo "not_found";
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["validateOTP"])) {
    $enteredOTP = $_GET["enteredOTP"];
    $sentOTP = $_SESSION["otp"];

    if ($enteredOTP == $sentOTP) {
        echo "valid";
    } else {
        echo "invalid";
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["updatePassword"])) {
    $newPassword = $_GET["newPassword"];
    $username = $_SESSION['username'];

    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE username = ?");
    $stmt->bind_param("ss", $newPassword, $username);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "failure";
    }
}

$conn->close();
?>
