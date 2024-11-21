<?php

$host = "localhost";
$username = "root";
$password = "";
$database = "qlkh";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Kết lối thất bại!" . mysqli_connect_error());
}

// kiem tra action truyen vao da duoc khoi tao hay chua va kiem tra xem co rong khong
$action = isset($_GET['action']) ? $_GET['action'] : null;

$response = [];
// Xử lý theo từng hành động
switch ($action) {
    case 'deleteProduct':
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        $crrImg = isset($_GET['img']) ? $_GET['img'] : '';

        $sql = "DELETE FROM hang_hoa WHERE id = $id";

        if(mysqli_query($conn, $sql)) {
            if($crrImg) {
                unlink($crrImg);
            }
            $response = [
                'success' => true
            ];
        } else {
            $response = [
                'error' => 'Failed to delete product',
                'details' => mysqli_error($conn)
            ];
        }

        break;

    default:
    $response = ["error" => "Invalid action"];
    break;
}

// Trả về dữ liệu JSON
header('Content-Type: application/json');
echo json_encode($response);

mysqli_close($conn);
?>