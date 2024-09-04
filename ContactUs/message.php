<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

$config = parse_ini_file('../config.cfg', true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = $_POST["firstName"] ?? "";
    $lastName = $_POST["lastName"] ?? "";
    $email = $_POST["email"] ?? "";
    $phoneNumber = $_POST["phoneNumber"] ?? "";
    $title = $_POST["title"] ?? "";
    $description = $_POST["description"] ?? "";

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
        $mail->addAddress($config['MAIL']['host']);

        $mail->isHTML(true);
        $mail->Subject = $title;
        $mail->Body    = "<b>First Name:</b> $firstName<br>" .
                         "<b>Last Name:</b> $lastName<br>" .
                         "<b>Email:</b> $email<br>" .
                         "<b>Phone Number:</b> $phoneNumber<br>" .
                         "<b>Title:</b> $title<br><br>" .
                         "<b>Description:</b><br>$description";

        $mail->send();

        $feedbackMail = new PHPMailer(true);
        $feedbackMail->isSMTP();
        $feedbackMail->Host       = 'smtp.gmail.com';
        $feedbackMail->SMTPAuth   = true;
        $feedbackMail->Username   = $config['MAIL']['username'];
        $feedbackMail->Password   = $config['MAIL']['password'];
        $feedbackMail->SMTPSecure = 'tls';
        $feedbackMail->Port       = 587;

        $feedbackMail->setFrom($config['MAIL']['setfrom'], 'Parking Finder');
        $feedbackMail->addAddress($email);

        $feedbackMail->isHTML(true);
        $feedbackMail->Subject = 'Thank you for contacting us!';
        $feedbackMail->Body    = 'Dear ' . $firstName . ',<br><br>' .
                                 'Thank you for contacting Parking Finder. Our team will review your query and get back to you soon.<br><br>' .
                                 'Best regards,<br>Parking Finder Team';

        $feedbackMail->send();

        echo "Email sent successfully.";
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Form submission method not allowed.";
}
?>
