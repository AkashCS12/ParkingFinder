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

    $stmt = $pdo->prepare("SELECT * FROM bookings WHERE tid = ?");
    $stmt->execute([$transactionId]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($bookings as $booking) {
        if ($booking['time'] >= $booking['timeout']) {
            $location = $booking['location'];
            
            $updateLocationSql = "UPDATE $location SET status = 'No Sensor Data', timeout = NULL WHERE id = ?";
            $updateLocationStmt = $pdo->prepare($updateLocationSql);
            $updateLocationStmt->execute([$booking['slot']]);

            $deleteSql = "DELETE FROM bookings WHERE tid = ?";
            $deleteStmt = $pdo->prepare($deleteSql);
            $deleteStmt->execute([$transactionId]);

            $updateSql = "UPDATE users SET tid = NULL WHERE username = ?";
            $updateStmt = $pdo->prepare($updateSql);
            $updateStmt->execute([$user_id]);
        } elseif ($booking['time'] <= $booking['timeout']) {
            $currentDateTime = date('Y-m-d H:i:s');
            $updateTimeSql = "UPDATE bookings SET time = ?";
            $updateTimeStmt = $pdo->prepare($updateTimeSql);
            $updateTimeStmt->execute([$currentDateTime]);
        }
    }

    echo json_encode($bookings);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Failed to fetch or update bookings: ' . $e->getMessage()]);
}
?>
