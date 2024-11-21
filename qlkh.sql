create table classify(
    id int auto_increment primary key,
    name varchar(255) not null,
    discount decimal(5, 2) not null
);

insert into classify (name, discount)
values 
("Thông thường", 0.00);

create table khach_hang(
    id int auto_increment primary key,
    name varchar(255) not null,
    address text,
    phoneNum varchar(15),
    classify_id int not null default 1,
    avatar_url varchar(255),
    join_date datetime default current_timestamp,
    user_name varchar(255) not null,
    password varchar(255) not null,
    active tinyint(1) default 1,
    foreign key (classify_id) references classify(id)
);

create table hang_hoa(
    id int auto_increment primary key,
    name text not null,
    price decimal(10, 2) not null,
    img_url text,
    stock int default 0, 
    sold int default 0,
    create_at datetime default current_timestamp
);

create table giao_dich(
    id int auto_increment primary key,
    khach_hang_id int,
    create__at date not null,
    total_amount decimal(15, 2),
    foreign key (khach_hang_id) references khach_hang(id)
);

CREATE TABLE chi_tieu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ngay_chi DATE NOT NULL,
    so_tien DECIMAL(15, 2) NOT NULL,
    loai_chi VARCHAR(100),
    mo_ta TEXT
);

CREATE TABLE don_hang (
    id INT AUTO_INCREMENT PRIMARY KEY,
    khach_hang_id INT NOT NULL,
    create_at DATETIME NOT NULL,
    status ENUM('completed', 'cancelled') NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)
);

insert into classify (name, discount)
values 
("Hạng Bạc", 10.00),
("Hạng Vàng", 25.00),
("VIP", 50.00);

insert into khach_hang (name, address, phoneNum, classify, avatar_url, user_name, password, active)
values
("Phạm Thành Công", "24 Đống Đa, Hà Nội", "0234516241", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123"),
("Nguyễn Đăng Khoa", "31 Hàng Đống, Hà Nội", "0234516241", "../bucket/image/avatar/Nguyễn Đăng Khoa.jpg", "user", "123"),
("Phạm Thành Long", "24 Đống Đa, Hà Nội", "0234516242", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123"),
("Trần Văn Bình", "12 Hoàng Mai, Hà Nội", "0234516243", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123"),
("Ngô Thanh Hòa", "98 Láng Hạ, Hà Nội", "0234516244", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123"),
("Lê Thị Thu", "56 Kim Liên, Hà Nội", "0234516245", "../bucket/image/avatar/Phạm Thành Công.jpg", , "user", "123"),
("Hoàng Văn Dũng", "45 Tôn Đức Thắng, Hà Nội", "0234516246", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123"),
("Nguyễn Minh Anh", "78 Cầu Giấy, Hà Nội", "0234516247", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123"),
("Phạm Thị Hồng", "89 Đại La, Hà Nội", "0234516248", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123"),
("Vũ Thanh Hà", "32 Lạc Long Quân, Hà Nội", "0234516249", "../bucket/image/avatar/Phạm Thành Công.jpg", "user", "123");
("Trần Thị Lan", "11 Trung Kính, Hà Nội", "0234516250", "../bucket/image/avatar/Trần Thị Lan.jpg", "user", "123");



INSERT INTO hang_hoa (name, price, img_url, stock, sold) 
VALUES
("Chuối", 15000, "../bucket/image/hang_hoa/chuoi.jpg", 50, 200),
("Bưởi", 30000, "../bucket/image/hang_hoa/buoi.jpg", 20, 150),
("Na", 40000, "../bucket/image/hang_hoa/na.jpg", 0, 120),
("Nước mắm", 25000, "../bucket/image/hang_hoa/nuocmam.jpg", 30, 90),
("Gà", 120000, "../bucket/image/hang_hoa/ga.jpg", 15, 50),
("Lươn", 200000, "../bucket/image/hang_hoa/luon.jpg", 0, 25),
("Thịt lợn", 100000, "../bucket/image/hang_hoa/thit_lon.jpg", 40, 300),
("Khế", 20000, "../bucket/image/hang_hoa/khe.jpg", 10, 60),
("Thịt bò", 250000, "../bucket/image/hang_hoa/thit_bo.jpg", 25, 200),
("Bim bim Lays", 12000, "../bucket/image/hang_hoa/bim_bim.jpg", 100, 500),
("Táo", 50000, "../bucket/image/hang_hoa/tao.jpg", 50, 100),
("Nho", 60000, "../bucket/image/hang_hoa/nho.jpg", 10, 80),
("Dưa hấu", 35000, "../bucket/image/hang_hoa/duahau.jpg", 0, 250),
("Xoài", 45000, "../bucket/image/hang_hoa/xoai.jpg", 30, 70),
("Cà chua", 25000, "../bucket/image/hang_hoa/cachua.jpg", 20, 120),
("Cải xanh", 15000, "../bucket/image/hang_hoa/caixanh.jpg", 15, 90),
("Bắp cải", 20000, "../bucket/image/hang_hoa/bapcai.jpg", 60, 200),
("Khoai tây", 30000, "../bucket/image/hang_hoa/khoaitay.jpg", 10, 50),
("Khoai lang", 25000, "../bucket/image/hang_hoa/khoailang.jpg", 25, 150),
("Hành tím", 40000, "../bucket/image/hang_hoa/hanhtim.jpg", 0, 45),
("Tỏi", 50000, "../bucket/image/hang_hoa/toi.jpg", 0, 100),
("Bánh mì", 10000, "../bucket/image/hang_hoa/banhmi.jpg", 200, 400),
("Bánh tráng", 30000, "../bucket/image/hang_hoa/banhtrang.jpg", 50, 80),
("Kem", 15000, "../bucket/image/hang_hoa/kem.jpg", 10, 40),
("Nước ngọt", 12000, "../bucket/image/hang_hoa/nuocngot.jpg", 5, 300),
("Trà xanh", 10000, "../bucket/image/hang_hoa/traxanh.jpg", 10, 150),
("Cà phê", 35000, "../bucket/image/hang_hoa/caphe.jpg", 20, 250);

INSERT INTO giao_dich (khach_hang_id, create__at, total_amount) 
VALUES
(1, '2024-08-10', 500000),
(2, '2024-08-15', 700000),
(1, '2024-09-05', 1200000),
(3, '2024-09-20', 2000000),
(2, '2024-10-01', 4000000),
(4, '2024-10-18', 4000000),
(1, '2024-11-05', 6000000),
(3, '2024-11-25', 8000000);

INSERT INTO chi_tieu (ngay_chi, so_tien, loai_chi, mo_ta) 
VALUES
('2024-05-10', 3000000, 'Lương', 'Chi trả lương tháng 5'),
('2024-05-20', 2000000, 'Nguyên vật liệu', 'Mua hàng tồn kho'),
('2024-05-30', 1000000, 'Vận chuyển', 'Chi phí vận chuyển'),
('2024-06-05', 4000000, 'Lương', 'Chi trả lương tháng 6'),
('2024-06-15', 3000000, 'Nguyên vật liệu', 'Mua thêm hàng hóa'),
('2024-06-25', 1000000, 'Khác', 'Chi phí phát sinh'),
('2024-07-10', 5000000, 'Lương', 'Chi trả lương tháng 7'),
('2024-07-20', 3000000, 'Quảng cáo', 'Chi phí marketing tháng 7'),
('2024-07-30', 1000000, 'Vận chuyển', 'Chi phí vận chuyển tháng 7'),
('2024-08-05', 7000000, 'Lương', 'Chi trả lương tháng 8'),
('2024-08-15', 5000000, 'Nguyên vật liệu', 'Mua hàng tồn kho tháng 8'),
('2024-08-25', 2000000, 'Khác', 'Chi phí phát sinh tháng 8');

INSERT INTO don_hang (khach_hang_id, create_at, status, total_amount) VALUES
(1, '2024-11-15 10:30:00', 'completed', 1500000.00),
(2, '2024-11-16 14:20:00', 'cancelled', 750000.00),
(3, '2024-11-17 09:45:00', 'completed', 2000000.00),
(1, '2024-11-18 18:10:00', 'completed', 500000.00),
(2, '2024-11-19 11:00:00', 'cancelled', 1200000.00),
(5, '2024-11-20 15:50:00', 'completed', 300000.00);
