<?php

$host = "localhost";
$username = "root";
$password = "";
$database = "ql_kh";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    die("Kết lối thất bại!" . mysqli_connect_error());
}

$action = isset($_GET['action']) ? $_GET['action'] : null;

$response = [];
switch ($action) {
    case 'deactivateAllCustomers':
        $sql = "UPDATE khach_hang SET active = 0";

        if (mysqli_query($conn, $sql)) {
            $response = [
                'success' => true,
                'message' => 'All customers have been deactivated successfully.'
            ];
        } else {
            $response = [
                'error' => 'Failed to deactivate customers',
                'details' => mysqli_error($conn)
            ];
        }
        break;

    case 'activateAllCustomers':
        $sql = "UPDATE khach_hang SET active = 1";

        if (mysqli_query($conn, $sql)) {
            $response = [
                'success' => true,
                'message' => 'All customers have been activated successfully.'
            ];
        } else {
            $response = [
                'error' => 'Failed to activate customers',
                'details' => mysqli_error($conn)
            ];
        }
        break;

    case 'deactivateCustomers':

        $ids = isset($_GET['ids']) ? explode(",", $_GET['ids']) : [];

        if (empty($ids)) {
            $response = ['error' => 'Không có khách hàng nào được chọn'];
            break;
        }

        $idsList = implode(',', array_map('intval', $ids)); // đảm bảo kiểu dữ liệu là int

        $sql = "UPDATE khach_hang SET active = 0  WHERE id IN ($idsList)";

        if (mysqli_query($conn, $sql)) {
            $response = [
                'success' => true,
            ];
        } else {
            $response = [
                'error' => 'Failed to deactivate customers',
                'details' => mysqli_error($conn)
            ];
        }
        break;

    case 'activateCustomers':

        $ids = isset($_GET['ids']) ? explode(",", $_GET['ids']) : [];

        if (empty($ids)) {
            $response = ['error' => 'Không có khách hàng nào được chọn'];
            break;
        }

        $idsList = implode(',', array_map('intval', $ids)); // đảm bảo kiểu dữ liệu là int

        $sql = "UPDATE khach_hang SET active = 1  WHERE id IN ($idsList)";

        if (mysqli_query($conn, $sql)) {
            $response = [
                'success' => true,
            ];
        } else {
            $response = [
                'error' => 'Failed to activate customers',
                'details' => mysqli_error($conn)
            ];
        }
        break;

    case 'deactivateCustomer':
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

        if ($id != 0) {
            $sql = "UPDATE khach_hang SET active = 0 WHERE id = $id";
            if (mysqli_query($conn, $sql)) {
                $response = [
                    'success' => true,
                ];
            } else {
                $response = [
                    'error' => 'Failed to deactivate customers',
                    'details' => mysqli_error($conn)
                ];
            }

        } else {
            $response = ['error' => "Không tìm thấy khách hàng với id: $id"];
            break;
        }
        break;

    case 'activateCustomer':
        $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

        if ($id != 0) {
            $sql = "UPDATE khach_hang SET active = 1 WHERE id = $id";
            if (mysqli_query($conn, $sql)) {
                $response = [
                    'success' => true,
                ];
            } else {
                $response = [
                    'error' => 'Failed to activate customers',
                    'details' => mysqli_error($conn)
                ];
            }

        } else {
            $response = ['error' => "Không tìm thấy khách hàng với id: $id"];
            break;
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