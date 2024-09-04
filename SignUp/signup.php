<?php

$config = parse_ini_file('../config.cfg', true);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

session_start();

$servername = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email='$email'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        echo "email_exists";
        exit();
    }

    $sql = "SELECT * FROM users WHERE username='$username'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        echo "username_exists";
        exit();
    }

    $sql = "INSERT INTO users (username, email, phone, password) VALUES ('$username', '$email', '$phone', '$password')";

    if ($conn->query($sql) === TRUE) {
        setcookie("loggedIn", "true", time() + (86400 * 30), "/");
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        $_SESSION['phone'] = $phone;
        $_SESSION['password'] = $password;

        sendWelcomeEmail($email, $username);

        echo "success";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}
$conn->close();

function sendWelcomeEmail($email, $username) {
    global $config;
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['MAIL']['username'];
        $mail->Password   = $config['MAIL']['password'];
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        $mail->setFrom($config['MAIL']['setfrom'], 'Parking Finder');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Welcome to Parking Finder!';
        $mail->Body = '
            <html>
            <head>
                <style>
                    .title {
                        color: #1E90FF;
                        font-size: 24px;
                        font-weight: bold;
                    }
                    .benefit {
                        color: #2E8B57;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    .com {
                        font-size:14px;
                        font-weight: bold;
                    }
                    .best{
                        margin-top: 10px;
                        font-size: 14px;
                        font-weight: bold;
                    }
                    .start{
                        margin-top: 14px;
                        margin-bottom: 10px;
                        font-size: 14px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <p class="com">Dear ' . $username . ',</p>
                <p class="title">Welcome to Parking Finder!</p>
                <p class="com">We are thrilled to have you join our community. Parking Finder offers a range of benefits:</p>
                <ul>
                    <li class="benefit">Easy and convenient parking spot reservation</li>
                    <li class="benefit">Real-time updates on available parking spaces</li>
                    <li class="benefit">Exclusive discounts and offers for registered users</li>
                    <li class="benefit">User-friendly interface for hassle-free experience</li>
                </ul>
                <p class="start">Get started today and enjoy stress-free parking!</p>
                <div class="image-container">
                <a href="https://parkingfinder-bist.000webhostapp.com">
                    <img src="https://www.parkinghawker.com/blog_image/42_smart_parking.jpg" alt="img">
                </a>
            </div>
                <p class="best">Best regards,<br>Parking Finder Team</p>
            </body>
            </html>
        ';

        $mail->send();
        return true;
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        return false;
    }
}

?>
