<?php
session_start();

if (!isset($_SESSION['username'])) {
    echo json_encode(['error' => 'User is not logged in.']);
    exit;
}

$config = parse_ini_file('../config.cfg', true);

$host = $config['DATABASE']['servername'];
$username = $config['DATABASE']['username'];
$password = $config['DATABASE']['password'];
$dbname = $config['DATABASE']['dbname'];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to connect to the database: ' . $e->getMessage()]);
    exit;
}

$user_id = $_SESSION['username'];

try {
    $getTransactionId = $pdo->prepare("SELECT tid FROM users WHERE username = ?");
    $getTransactionId->execute([$user_id]);
    $transactionId = $getTransactionId->fetchColumn();
    $getTransactionId->closeCursor();

    if (!$transactionId) {
        echo json_encode(['error' => 'User transaction ID not found.']);
        exit;
    }

    $getBookingInfoSql = "SELECT location, slot FROM bookings WHERE tid = ?";
    $getBookingInfoStmt = $pdo->prepare($getBookingInfoSql);
    $getBookingInfoStmt->execute([$transactionId]);
    $bookingInfo = $getBookingInfoStmt->fetch(PDO::FETCH_ASSOC);

    $location = $bookingInfo['location'];
    $slot = $bookingInfo['slot'];

    $deleteBookingSql = "DELETE FROM bookings WHERE tid = ?";
    $deleteBookingStmt = $pdo->prepare($deleteBookingSql);
    $deleteBookingStmt->execute([$transactionId]);

    $updateUserSql = "UPDATE users SET tid = NULL WHERE username = ?";
    $updateUserStmt = $pdo->prepare($updateUserSql);
    $updateUserStmt->execute([$user_id]);

    $updateSlotSql = "UPDATE $location SET status = 'No Sensor Data', timeout = NULL WHERE id = ?";
    $updateSlotStmt = $pdo->prepare($updateSlotSql);
    $updateSlotStmt->execute([$slot]);

    if ($deleteBookingStmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'location' => $location, 'slot' => $slot]);
    } else {
        echo json_encode(['error' => 'Booking not found or already deleted.']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to delete booking: ' . $e->getMessage()]);
}
?>