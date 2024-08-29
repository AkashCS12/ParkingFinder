<?php
session_start();

if (isset($_SESSION['username'])) {
    $userData = array(
        'email' => $_SESSION['email'],
        'username' => $_SESSION['username'],
        'phone' => $_SESSION['phone']
    );
    echo json_encode($userData);
} else {
    echo json_encode(array('error' => 'User not logged in'));
}
?>
