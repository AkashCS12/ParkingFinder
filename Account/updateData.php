<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

session_start();

if (isset($_SESSION['username'])) {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $field = $_POST['field'];
        $newValue = $_POST['value'];
        $password = $_POST['password'];

        $config = parse_ini_file('../config.cfg', true);

        $servername = $config['DATABASE']['servername'];
        $username = $config['DATABASE']['username'];
        $password_db = $config['DATABASE']['password'];
        $dbname = $config['DATABASE']['dbname'];

        $conn = new mysqli($servername, $username, $password_db, $dbname);

        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        if ($password === $_SESSION['password']) {
            switch ($field) {
                case 'email':
                    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
                    $stmt->bind_param("s", $newValue);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        echo json_encode(array('error' => 'Email already exists.'));
                        exit();
                    }
                    $stmt->close();

                    $stmt = $conn->prepare("UPDATE users SET email = ? WHERE username = ?");
                    $stmt->bind_param("ss", $newValue, $_SESSION['username']);
                    $stmt->execute();
                    $_SESSION['email'] = $newValue;
                    $message = "Your email has been changed to: $newValue";
                    break;
                case 'username':
                    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
                    $stmt->bind_param("s", $newValue);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        echo json_encode(array('error' => 'Username already exists.'));
                        exit();
                    }
                    $stmt->close();

                    $stmt = $conn->prepare("UPDATE users SET username = ? WHERE username = ?");
                    $stmt->bind_param("ss", $newValue, $_SESSION['username']);
                    $stmt->execute();
                    $_SESSION['username'] = $newValue;
                    $message = "Your username has been changed to: $newValue";
                    break;
                case 'phone':
                    $stmt = $conn->prepare("UPDATE users SET phone = ? WHERE username = ?");
                    $stmt->bind_param("ss", $newValue, $_SESSION['username']);
                    $stmt->execute();
                    $_SESSION['phone'] = $newValue;
                    $message = "Your phone number has been changed to: $newValue";
                    break;
                default:
                    echo json_encode(array('error' => 'Invalid field'));
                    exit();
            }
            
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username   = $config['MAIL']['username'];
            $mail->Password   = $config['MAIL']['password'];
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;
    
            $mail->setFrom($config['MAIL']['setfrom'], 'Parking Finder');
            $mail->addAddress($_SESSION['email'], $_SESSION['username']);

            $mail->isHTML(true);
            $mail->Subject = 'Changes in your Parking Finder account';
            $mail->Body = $message;

            if(!$mail->send()) {
                echo json_encode(array('error' => 'Email could not be sent.'));
            } else {
                echo json_encode(array('success' => true, 'message' => 'Changes saved successfully. Email notification sent.'));
            }
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
