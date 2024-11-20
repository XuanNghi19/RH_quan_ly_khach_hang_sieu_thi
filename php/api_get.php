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
    case 'getHangHoaStock':
        // Truy vấn lấy tổng số lượng hàng hóa trong kho và đã bán
        $sql = "SELECT 
                    SUM(stock) AS total_stock, 
                    SUM(sold) AS total_sold 
                FROM hang_hoa";

        // Thực hiện truy vấn
        $result = mysqli_query($conn, $sql);

        // Lấy kết quả và trả về dữ liệu
        $response = [];
        if ($result) {
            $row = mysqli_fetch_assoc($result);
            $response = [
                'total_stock' => $row['total_stock'],  // Tổng số lượng hàng hóa tồn kho
                'total_sold' => $row['total_sold']    // Tổng số lượng hàng hóa đã bán
            ];
        }
        break;

    case 'getHangHoa':
        // Truy vấn lấy số lượng hàng hóa
        $sql = "SELECT 
                    id, 
                    name, 
                    stock, 
                    sold 
                FROM hang_hoa";

        // Thực hiện truy vấn
        $result = mysqli_query($conn, $sql);

        // Lấy kết quả và trả về dữ liệu
        $response = [];
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $response[] = $row;
            }
        }
        break;

    case 'getHangHoaChart':
        // Truy vấn dữ liệu hàng hóa
        $sql = "SELECT 
            SUM(CASE WHEN sold > 200 THEN 1 ELSE 0 END) AS ban_chay,
            SUM(CASE WHEN stock > 0 THEN 1 ELSE 0 END) AS ton_kho,
            SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) AS het_hang
            FROM hang_hoa";
        $result = mysqli_query($conn, $sql);
        $response = $result ? mysqli_fetch_assoc($result) : [];
        break;

    case 'getDoanhThuChart':
        // Truy vấn dữ liệu doanh thu 4 tháng gần nhất
        $sql = "SELECT 
                DATE_FORMAT(create__at, '%m-%Y') AS thang,
                SUM(total_amount) AS doanh_thu
                FROM giao_dich
                WHERE create__at >= DATE_ADD(CURDATE(), INTERVAL -4 MONTH)
                GROUP BY thang
                ORDER BY thang ASC";
        $result = mysqli_query($conn, $sql);
        $response = [];
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $response[] = $row;
            }
        }
        break;


    case 'getChiTieuChart':
        // Truy vấn dữ liệu chi tiêu 4 tháng gần nhất
        $sql = "SELECT 
                DATE_FORMAT(ngay_chi, '%m-%Y') AS thang,
                SUM(so_tien) AS chi_tieu
                FROM chi_tieu
                WHERE ngay_chi >= DATE_ADD(CURDATE(), INTERVAL -4 MONTH)
                GROUP BY thang
                ORDER BY thang ASC";
        $result = mysqli_query($conn, $sql);
        $response = [];
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $response[] = $row;
            }
        }
        break;

    case 'getCustomerStats':
        $response = [];

        // Khách hàng mua nhiều nhất
        $sql = "SELECT k.id, k.name, k.avatar_url, SUM(d.total_amount) AS total_spent
            FROM khach_hang k
            JOIN don_hang d ON k.id = d.khach_hang_id
            WHERE d.status = 'completed'
            GROUP BY k.id
            ORDER BY total_spent DESC
            LIMIT 1";
        $result = mysqli_query($conn, $sql);
        $response['top_customer'] = $result ? mysqli_fetch_assoc($result) : null;

        // Khách hàng hủy đơn nhiều nhất
        $sql = "SELECT k.id, k.name, k.avatar_url, COUNT(d.id) AS cancel_count
            FROM khach_hang k
            JOIN don_hang d ON k.id = d.khach_hang_id
            WHERE d.status = 'cancelled'
            GROUP BY k.id
            ORDER BY cancel_count DESC
            LIMIT 1";
        $result = mysqli_query($conn, $sql);
        $response['most_cancelled_customer'] = $result ? mysqli_fetch_assoc($result) : null;

        //Khách hàng mới nhất
        $sql = "SELECT id, name, avatar_url, join_date
            FROM khach_hang
            ORDER BY join_date DESC
            LIMIT 1";
        $result = mysqli_query($conn, $sql);
        $response['newest_customer'] = $result ? mysqli_fetch_assoc($result) : null;
        break;

    case 'getClassifies':
        $sql = "
            SELECT * FROM classify
            order by discount ASC
        ";
        $result = mysqli_query($conn, $sql);
        $response = [];
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $response[] = $row;
            }
        }

        break;

    case 'getCustomers':
        // API: getCustomers
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;

        $sql = "SELECT * FROM khach_hang LIMIT $limit OFFSET $offset";
        $result = mysqli_query($conn, $sql);

        $response = [
            'customers' => [],
            'total' => 0
        ];

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $response['customers'][] = $row;
                }
            } else {
                echo "No customers found.";
            }
        }

        // tổng số lượng khách hàng (để tính tổng số trang)
        $sqlTotal = "SELECT COUNT(*) AS total FROM khach_hang";
        $totalResult = mysqli_query($conn, $sqlTotal);
        $total = mysqli_fetch_assoc($totalResult)['total'];
        $response['total'] = $total;
        break;

    case 'findCustomersByClassify':
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $offset = ($page - 1) * $limit;
        $classify_id = isset($_GET['classify_id']) ? (int) $_GET['classify_id'] : 1;

        $sql = "SELECT * FROM khach_hang
                WHERE classify_id = $classify_id LIMIT $limit OFFSET $offset";
        $result = mysqli_query($conn, $sql);

        // Khởi tạo mảng response
        $response = [
            'customers' => [],
            'total' => 0
        ];

        if ($result) {
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $response['customers'][] = $row;
                }
            }
        }

        $sqlTotal = "SELECT COUNT(*) AS total FROM khach_hang WHERE classify_id = $classify_id";
        $totalResult = mysqli_query($conn, $sqlTotal);
        $total = mysqli_fetch_assoc($totalResult)['total'];
        $response['total'] = $total;
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