-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2024 at 12:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qlkh`
--

-- --------------------------------------------------------

--
-- Table structure for table `chi_tieu`
--

CREATE TABLE `chi_tieu` (
  `id` int(11) NOT NULL,
  `ngay_chi` date NOT NULL,
  `so_tien` decimal(15,2) NOT NULL,
  `loai_chi` varchar(100) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chi_tieu`
--

INSERT INTO `chi_tieu` (`id`, `ngay_chi`, `so_tien`, `loai_chi`, `mo_ta`) VALUES
(1, '2024-08-10', 3000000.00, 'Lương', 'Chi trả lương tháng 5'),
(2, '2024-08-20', 2000000.00, 'Nguyên vật liệu', 'Mua hàng tồn kho'),
(3, '2024-08-30', 1000000.00, 'Vận chuyển', 'Chi phí vận chuyển'),
(4, '2024-09-05', 4000000.00, 'Lương', 'Chi trả lương tháng 6'),
(5, '2024-09-15', 3000000.00, 'Nguyên vật liệu', 'Mua thêm hàng hóa'),
(6, '2024-09-25', 1000000.00, 'Khác', 'Chi phí phát sinh'),
(7, '2024-10-10', 5000000.00, 'Lương', 'Chi trả lương tháng 7'),
(8, '2024-10-20', 3000000.00, 'Quảng cáo', 'Chi phí marketing tháng 7'),
(9, '2024-10-30', 1000000.00, 'Vận chuyển', 'Chi phí vận chuyển tháng 7'),
(10, '2024-11-05', 7000000.00, 'Lương', 'Chi trả lương tháng 8'),
(11, '2024-11-15', 5000000.00, 'Nguyên vật liệu', 'Mua hàng tồn kho tháng 8'),
(12, '2024-11-25', 2000000.00, 'Khác', 'Chi phí phát sinh tháng 8');

-- --------------------------------------------------------

--
-- Table structure for table `classify`
--

CREATE TABLE `classify` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `discount` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classify`
--

INSERT INTO `classify` (`id`, `name`, `discount`) VALUES
(1, 'Thông thường', 0.00),
(2, 'Hạng Bạc', 10.00),
(3, 'Hạng Vàng', 25.00),
(4, 'VIP', 50.00),
(5, 'Hạng Đồng', 5.00),
(6, 'p', 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `don_hang`
--

CREATE TABLE `don_hang` (
  `id` int(11) NOT NULL,
  `khach_hang_id` int(11) NOT NULL,
  `create_at` datetime NOT NULL,
  `status` enum('completed','cancelled') NOT NULL,
  `total_amount` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `don_hang`
--

INSERT INTO `don_hang` (`id`, `khach_hang_id`, `create_at`, `status`, `total_amount`) VALUES
(1, 1, '2024-11-15 10:30:00', 'completed', 1500000.00),
(2, 2, '2024-11-16 14:20:00', 'cancelled', 750000.00),
(3, 3, '2024-11-17 09:45:00', 'completed', 2000000.00),
(4, 1, '2024-11-18 18:10:00', 'completed', 500000.00),
(5, 2, '2024-11-19 11:00:00', 'cancelled', 1200000.00),
(6, 5, '2024-11-20 15:50:00', 'completed', 300000.00);

-- --------------------------------------------------------

--
-- Table structure for table `giao_dich`
--

CREATE TABLE `giao_dich` (
  `id` int(11) NOT NULL,
  `khach_hang_id` int(11) DEFAULT NULL,
  `create__at` date NOT NULL,
  `total_amount` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `giao_dich`
--

INSERT INTO `giao_dich` (`id`, `khach_hang_id`, `create__at`, `total_amount`) VALUES
(1, 1, '2024-08-10', 5000000.00),
(2, 2, '2024-08-15', 4000000.00),
(3, 1, '2024-09-05', 6000000.00),
(4, 3, '2024-09-20', 5000000.00),
(5, 2, '2024-10-01', 4000000.00),
(6, 4, '2024-10-18', 5000000.00),
(7, 1, '2024-11-05', 4000000.00),
(8, 3, '2024-11-25', 8000000.00);

-- --------------------------------------------------------

--
-- Table structure for table `hang_hoa`
--

CREATE TABLE `hang_hoa` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `img_url` text DEFAULT NULL,
  `stock` int(11) DEFAULT 0,
  `sold` int(11) DEFAULT 0,
  `create_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hang_hoa`
--

INSERT INTO `hang_hoa` (`id`, `name`, `price`, `img_url`, `stock`, `sold`, `create_at`) VALUES
(1, 'Chuối', 15000.00, '../bucket/image/hang_hoa/chuoi.jpg', 50, 200, '2024-11-21 23:25:51'),
(2, 'Bưởi', 30000.00, '../bucket/image/hang_hoa/buoi.jpg', 0, 150, '2024-11-21 23:25:51'),
(3, 'Na', 40000.00, '../bucket/image/hang_hoa/na.jpg', 0, 120, '2024-11-21 23:25:51'),
(4, 'Nước mắm', 25000.00, '../bucket/image/hang_hoa/nuocmam.jpg', 30, 90, '2024-11-21 23:25:51'),
(5, 'Gà', 120000.00, '../bucket/image/hang_hoa/ga.jpg', 15, 50, '2024-11-21 23:25:51'),
(6, 'Lươn', 200000.00, '../bucket/image/hang_hoa/luon.jpg', 0, 25, '2024-11-21 23:25:51'),
(7, 'Thịt lợn', 100000.00, '../bucket/image/hang_hoa/thit_lon.jpg', 40, 300, '2024-11-21 23:25:51'),
(8, 'Khế', 20000.00, '../bucket/image/hang_hoa/khe.jpg', 10, 60, '2024-11-21 23:25:51'),
(9, 'Thịt bò', 250000.00, '../bucket/image/hang_hoa/thit_bo.jpg', 25, 200, '2024-11-21 23:25:51'),
(10, 'Bim bim Lays', 12000.00, '../bucket/image/hang_hoa/bim_bim.jpg', 0, 500, '2024-11-21 23:25:51'),
(11, 'Táo', 50000.00, '../bucket/image/hang_hoa/tao.jpg', 50, 100, '2024-11-21 23:25:51'),
(12, 'Nho', 60000.00, '../bucket/image/hang_hoa/nho.jpg', 10, 80, '2024-11-21 23:25:51'),
(13, 'Dưa hấu', 35000.00, '../bucket/image/hang_hoa/duahau.png', 0, 250, '2024-11-21 23:25:51'),
(14, 'Xoài', 45000.00, '../bucket/image/hang_hoa/xoai.jpg', 30, 70, '2024-11-21 23:25:51'),
(15, 'Cà chua', 25000.00, '../bucket/image/hang_hoa/cachua.jpg', 20, 120, '2024-11-21 23:25:51'),
(16, 'Cải xanh', 15000.00, '../bucket/image/hang_hoa/caixanh.jpg', 15, 90, '2024-11-21 23:25:51'),
(17, 'Bắp cải', 20000.00, '../bucket/image/hang_hoa/bapcai.jpg', 60, 200, '2024-11-21 23:25:51'),
(18, 'Khoai tây', 30000.00, '../bucket/image/hang_hoa/khoaitay.jpg', 10, 50, '2024-11-21 23:25:51'),
(19, 'Khoai lang', 25000.00, '../bucket/image/hang_hoa/khoailang.jpg', 25, 150, '2024-11-21 23:25:51'),
(20, 'Hành tím', 40000.00, '../bucket/image/hang_hoa/hanhtim.jpg', 0, 45, '2024-11-21 23:25:51'),
(21, 'Tỏi', 50000.00, '../bucket/image/hang_hoa/toi.jpg', 0, 100, '2024-11-21 23:25:51'),
(22, 'Bánh mì', 10000.00, '../bucket/image/hang_hoa/banhmi.jpg', 200, 400, '2024-11-21 23:25:51'),
(23, 'Bánh tráng', 30000.00, '../bucket/image/hang_hoa/banhtrang.jpg', 50, 80, '2024-11-21 23:25:51'),
(24, 'Kem', 15000.00, '../bucket/image/hang_hoa/kem.jpg', 10, 40, '2024-11-21 23:25:51'),
(25, 'Nước ngọt', 12000.00, '../bucket/image/hang_hoa/nuocngot.jpg', 5, 300, '2024-11-21 23:25:51'),
(26, 'Trà xanh', 10000.00, '../bucket/image/hang_hoa/traxanh.jpg', 10, 150, '2024-11-21 23:25:51'),
(27, 'Cà phê', 35000.00, '../bucket/image/hang_hoa/caphe.jpg', 20, 250, '2024-11-21 23:25:51');

-- --------------------------------------------------------

--
-- Table structure for table `khach_hang`
--

CREATE TABLE `khach_hang` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `phoneNum` varchar(15) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `join_date` datetime DEFAULT current_timestamp(),
  `classify_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khach_hang`
--

INSERT INTO `khach_hang` (`id`, `name`, `address`, `phoneNum`, `avatar_url`, `join_date`, `classify_id`, `user_name`, `password`, `active`) VALUES
(1, 'Phạm Thành Công', '24 Đống Đa, Hà Nội', '0234516241', '../bucket/image/avatar/Phạm Thành Công.jpeg', '2024-11-20 01:42:05', 1, 'user', '123', 1),
(2, 'Nguyễn Đăng Khoa', '31 Hàng Đống, Hà Nội', '0234516241', '../bucket/image/avatar/Nguyễn Đăng Khoa.jpg', '2024-11-20 01:42:05', 2, 'user', '123', 1),
(3, 'Phạm Thành Công', '24 Đống Đa, Hà Nội', '0234516242', NULL, '2024-11-20 01:42:05', 3, 'user', '123', 1),
(4, 'Trần Văn Bình', '12 Hoàng Mai, Hà Nội', '0234516243', NULL, '2024-11-20 01:42:05', 4, 'user', '123', 1),
(5, 'Ngô Thanh Hòa', '98 Láng Hạ, Hà Nội', '0234516244', NULL, '2024-11-20 01:42:05', 5, 'user', '123', 1),
(6, 'Lê Thị Thu', '56 Kim Liên, Hà Nội', '0234516245', NULL, '2024-11-20 01:42:05', 1, 'user', '123', 1),
(7, 'Hoàng Văn Dũng', '45 Tôn Đức Thắng, Hà Nội', '0234516246', NULL, '2024-11-20 01:42:05', 1, 'user', '123', 1),
(8, 'Nguyễn Minh Anh', '78 Cầu Giấy, Hà Nội', '0234516247', NULL, '2024-11-20 01:42:05', 1, 'user', '123', 1),
(9, 'Phạm Thị Hồng', '89 Đại La, Hà Nội', '0234516248', NULL, '2024-11-20 01:42:05', 1, 'user', '123', 1),
(10, 'Vũ Thanh Hà', '32 Lạc Long Quân, Hà Nội', '0234516249', NULL, '2024-11-20 01:42:05', 1, 'user', '123', 1),
(11, 'Trần Thị Lan', '11 Trung Kính, Hà Nội', '0234516250', '../bucket/image/avatar/Trần Thị Lan.jpg', '2024-11-20 01:43:05', 1, 'user', '123', 1),
(12, 'Phạm Huyền Trang', '121 Hà Đông, Hà Nội', '0912134567', NULL, '2024-11-21 11:45:19', 1, 'huyentrang', '$2y$10$uDS0b/r.sNnZB8vreFeZeudfXDJMokoI7ybIMNPKcWiH7a7zumFce', 1),
(13, 'Thiên Viết Ca', '32 Đống Đa, Hà Nội', '0632124567', NULL, '2024-11-21 11:46:06', 1, 'vietca', '$2y$10$jjHlAG.n1VKs4imD7Wddve.rivBTmQ4peVWulzTIw2lWot6g8pR9u', 1),
(14, 'Nguyễn Thị Lan', '36 Nguyễn Trãi, Hà Đông, Hà Nội', '0231456547', NULL, '2024-11-21 12:09:36', 1, 'thilan', '$2y$10$YuNkzM./Oi5aHRSBe1Obn.F8BWjqKsc0/nkdXFHrynCxc4URjgHbe', 1),
(15, 'Nam', 'đá', '023', NULL, '2024-11-21 12:11:47', 1, 'adsad', '$2y$10$A9ruPAa4UCQQGW1spA8ZKuOnPNTBhtqji4pWQewBV9fmEn7yfT2qa', 1),
(16, 'ádasd', 'đá', '023', NULL, '2024-11-21 12:12:12', 1, 'ads', '$2y$10$2UEu3DGHnKybNeBDhZlO3.CmXmPCn9k5Dyk2sMcxvwcQZBLQR4U6m', 1),
(17, 'đá', 'đá', 'đá', NULL, '2024-11-21 12:12:20', 1, 'ád', '$2y$10$ZOzVXKMHLEmUDN07BPh.gOGSjG/4R9RYVY3v2/ZgSctLVisGQIAiC', 1),
(18, 'dsaasd', 'dsada', 'ád', NULL, '2024-11-21 12:12:43', 1, 'ád', '$2y$10$CEL3F5H22/11V80ehdp47Og4d14Ugyh6w7g0TrR49v5BH6XjFUbZm', 1),
(19, 'Nguyễn Ánh', '123', '0365214563', NULL, '2024-11-21 12:13:04', 2, '123', '$2y$10$UhVP0JRTpxF5GcTj4npyI.oaE4LjgmLR2WX8e7noW7nvSI6b0kMae', 1),
(20, 'đá', 'adsa', 'ád', NULL, '2024-11-21 12:30:45', 5, 'ád', '$2y$10$9Ut47qEFSTit33k2Phj50.48MrK1zl6O92cmnZ2lwfWYR90gNnXZm', 1),
(21, 'hangadasd', 'đá', 'ád', NULL, '2024-11-21 12:40:00', 2, 'ads', '$2y$10$inkfe1eW9.plDMLkDCp1leyF8/1.PWyK4Y61uNsRRqCUe3tEa9Y1a', 1),
(22, 'đá', 'ad', 'ád', NULL, '2024-11-21 14:34:14', 1, 'ad', '$2y$10$SO3EP8cOdJK.Z34sO6XHj.KPCp/xqMPPV5j.aepNm/21.eCJD1v4C', 1),
(23, 'dsa', 'sd', 'sda', NULL, '2024-11-21 14:34:49', 1, 'ád', '$2y$10$v1ZLfKZU1rkMJOHqR4saeORCzsvH5.Lasq1ZlD0gwiB6E4n3.WsM.', 1),
(24, 'da', 'ád', 'sda', NULL, '2024-11-21 14:34:58', 5, 'ád', '$2y$10$wQK7Kxacnh1hYPzGvOPc1.fLU0s7ZG.9kJ.qILSGB1iSVs/JTfB32', 1),
(25, 'Phạm', 'dá', '0315569', NULL, '2024-11-30 13:50:16', 6, 'đá', '$2y$10$Mn.N2xBvYfp8pu6/E4ilcOG8ELfGK6x9LyQv4QxskTtpjuTc1L1Om', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chi_tieu`
--
ALTER TABLE `chi_tieu`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `classify`
--
ALTER TABLE `classify`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `khach_hang_id` (`khach_hang_id`);

--
-- Indexes for table `giao_dich`
--
ALTER TABLE `giao_dich`
  ADD PRIMARY KEY (`id`),
  ADD KEY `khach_hang_id` (`khach_hang_id`);

--
-- Indexes for table `hang_hoa`
--
ALTER TABLE `hang_hoa`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `khach_hang`
--
ALTER TABLE `khach_hang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_classify` (`classify_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chi_tieu`
--
ALTER TABLE `chi_tieu`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `classify`
--
ALTER TABLE `classify`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `don_hang`
--
ALTER TABLE `don_hang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `giao_dich`
--
ALTER TABLE `giao_dich`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `hang_hoa`
--
ALTER TABLE `hang_hoa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `khach_hang`
--
ALTER TABLE `khach_hang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`);

--
-- Constraints for table `giao_dich`
--
ALTER TABLE `giao_dich`
  ADD CONSTRAINT `giao_dich_ibfk_1` FOREIGN KEY (`khach_hang_id`) REFERENCES `khach_hang` (`id`);

--
-- Constraints for table `khach_hang`
--
ALTER TABLE `khach_hang`
  ADD CONSTRAINT `fk_classify` FOREIGN KEY (`classify_id`) REFERENCES `classify` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;