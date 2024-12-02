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

    case 'updateProduct':
        $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
        $name = isset($_POST['name']) ? mysqli_real_escape_string($conn, $_POST['name']) : '';
        $price = isset($_POST['price']) ? (float) $_POST['price'] : 0;
        $stock = isset($_POST['stock']) ? (int) $_POST['stock'] : 0;
        $response = [];

        // Xử lý file ảnh
        $img_url = '';
        if (!empty($_FILES['img']['name'])) {
            $target_dir = "../bucket/image/hang_hoa/";
            $target_file = $target_dir . time() . "_" . basename($_FILES["img"]["name"]);
            if (move_uploaded_file($_FILES["img"]["tmp_name"], $target_file)) {
                $img_url = $target_file;
            }
            unlink(isset($_POST['current_img']) ? $_POST['current_img'] : '');
        }
        // Cập nhật sản phẩm
        $sql = "UPDATE hang_hoa SET 
                name = '$name', 
                price = '$price', 
                stock = '$stock'";

        if ($img_url) {
            $sql .= ", img_url = '$img_url'";
        }
        $sql .= " WHERE id = $id";

        if (mysqli_query($conn, $sql)) {
            $response = ['success' => true, 'message' => 'Sản phẩm đã được cập nhật.'];
        } else {
            $response = ['success' => false, 'error' => 'Lỗi khi cập nhật sản phẩm: ' . mysqli_error($conn)];
        }

        break;

    case 'createProduct':
        $name = isset($_POST['name']) ? mysqli_real_escape_string($conn, $_POST['name']) : '';
        $price = isset($_POST['price']) ? $_POST['price'] : 0;
        $response = [];

        // Kiểm tra dữ liệu đầu vào
        if (empty($name) || empty($_FILES['img']['name'])) {
            $response = ['error' => 'Invalid input data. Please provide valid name, price, stock, and image.'];
        } else {
            // Xử lý lưu ảnh
            $target_dir = "../bucket/image/hang_hoa/";
            $image_name = basename($_FILES['img']['name']);
            $target_file = $target_dir . time() . "_" . $image_name; // Thêm timestamp để tránh trùng tên

            if (move_uploaded_file($_FILES['img']['tmp_name'], $target_file)) {
                // Nếu lưu ảnh thành công, thêm sản phẩm vào database
                $img_url = $target_file;
                $sql = "INSERT INTO hang_hoa (name, price, img_url) 
                        VALUES ('$name', '$price', '$img_url')";

                if (mysqli_query($conn, $sql)) {
                    $last_id = mysqli_insert_id($conn);
                    $response = [
                        'success' => true,
                    ];
                } else {
                    $response = [
                        'error' => 'Failed to create product',
                        'details' => mysqli_error($conn),
                    ];
                    // Xóa ảnh nếu lưu vào DB thất bại
                    unlink($target_file);
                }
            } else {
                $response = ['error' => 'Failed to upload image.'];
            }
        }
        break;

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
    case 'createCustomer':
        $name = isset($_POST['name']) ? mysqli_real_escape_string($conn, $_POST['name']) : '';
        $address = isset($_POST['address']) ? mysqli_real_escape_string($conn, $_POST['address']) : '';
        $phone = isset($_POST['phone']) ? mysqli_real_escape_string($conn, $_POST['phone']) : '';
        $classify_id = isset($_POST['classifyID']) ? (int) $_POST['classifyID'] : 1;
        $username = isset($_POST['userName']) ? mysqli_real_escape_string($conn, $_POST['userName']) : 1;
        $password = isset($_POST['password']) ? mysqli_real_escape_string($conn, $_POST['password']) : '';

        if (empty($name) || empty($phone) || empty($password) || empty($classify_id)) {
            $response = ['error' => 'Invalid input data. Name, phone, password and classify_id are required.'];
        } else {
            // Mã hóa mật khẩu (password hashing)
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

            // Truy vấn thêm khách hàng
            $sql = "INSERT INTO khach_hang (name, address, phoneNum, user_name, password, classify_id, avatar_url, join_date) 
                        VALUES ('$name', '$address', '$phone', '$username', '$hashedPassword', $classify_id, NULL, NOW())";

            if (mysqli_query($conn, $sql)) {
                $last_id = mysqli_insert_id($conn);
                $response = ['success' => true, 'message' => 'Customer created successfully', 'id' => $last_id];
            } else {
                $response = ['error' => 'Failed to create customer', 'details' => mysqli_error($conn)];
            }
        }
        break;

    case 'updateCustomer':
        $id = isset($_POST['id']) ? (int) $_POST['id'] : 0;
        $classifyID = isset($_POST['classifyID']) ? (int) $_POST['classifyID'] : 1;
        $name = isset($_POST['name']) ? $_POST['name'] : '';
        $phone = isset($_POST['phone']) ? $_POST['phone'] : '';
        $address = isset($_POST['address']) ? $_POST['address'] : '';
        $userName = isset($_POST['userName']) ? $_POST['userName'] : '';
        $password = isset($_POST['password']) ? $_POST['password'] : '';

        if ($id && $name && $phone && $address && $userName) {
            // Mã hóa mật khẩu nếu có
            $sql = "";
            if ($password) {
                $passwordHash = password_hash($password, PASSWORD_BCRYPT);
                $sql = "UPDATE khach_hang SET
                            classify_id = $classifyID,
                            name = '$name',
                            phoneNum = '$phone',
                            address = '$address',
                            user_name = '$userName',
                            password = '$passwordHash'
                            WHERE id = $id";
            } else {
                $sql = "UPDATE khach_hang SET
                            classify_id = $classifyID,
                            name = '$name',
                            phoneNum = '$phone',
                            address = '$address',
                            user_name = '$userName'
                            WHERE id = $id";
            }

            // Thực thi câu lệnh SQL
            if (mysqli_query($conn, $sql)) {
                $response = [
                    'success' => true,
                    'message' => 'Customer updated successfully'
                ];
            } else {
                $response = [
                    'error' => 'Failed to update customer',
                    'details' => mysqli_error($conn)
                ];
            }
        } else {
            $response = [
                'error' => 'Invalid input data. Please provide valid information.'
            ];
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