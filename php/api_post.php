<?php

$host = "localhost";
$username = "root";
$password = "";
$database = "qlkh";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Kết lối thất bại!" . mysqli_connect_error());
}

$action = isset($_GET['action']) ? $_GET['action'] : null;

$response = [];
switch ($action) {
    case 'createClassify':
        $name = isset($_POST['name']) ? $_POST['name'] : '';
        $discount = isset($_POST['discount']) ? $_POST['discount'] : 0;

        if (empty($name) || $discount <= 0) {
            $response = ['error' => 'Invalid input data. Please provide valid name and discount.'];
        } else {
            $sql = "insert into classify (name, discount) values ('$name', '$discount')";

            if (mysqli_query($conn, $sql)) {
                $last_id = mysqli_insert_id($conn);
                $response = ['success' => true, 'message' => 'Classify created successfully', 'id' => $last_id];
            } else {
                $response = ['error' => 'Failed to create classify', 'details' => mysqli_error($conn)];
            }
        }
        break;

    default:
    $response = ["error" => "Invalid action"];
    break;
}

header('Content-Type: application/json');
echo json_encode($response);

mysqli_close($conn);
?>