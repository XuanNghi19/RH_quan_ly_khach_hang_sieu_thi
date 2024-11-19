create table khach_hang(
    id int auto_increment primary key,
    name varchar(255) not null,
    address text,
    phoneNum varchar(15),
    classify varchar(50) default 'Thông thường'
);

create table hang_hoa(
    id int auto_increment primary key,
    name text not null,
    price decimal(10, 2) not null,
    img_url text
);

insert into khach_hang (name, address, phoneNum, classify)
values
("Phạm Thành Công", "24 Đống Đa, Hà Nội", "0234516241"),
("Nguyễn Đăng Khoa", "31 Hàng Đống, Hà Nội", "0234516241"),
("Phạm Thành Công", "24 Đống Đa, Hà Nội", "0234516242"),
("Trần Văn Bình", "12 Hoàng Mai, Hà Nội", "0234516243"),
("Ngô Thanh Hòa", "98 Láng Hạ, Hà Nội", "0234516244"),
("Lê Thị Thu", "56 Kim Liên, Hà Nội", "0234516245"),
("Hoàng Văn Dũng", "45 Tôn Đức Thắng, Hà Nội", "0234516246"),
("Nguyễn Minh Anh", "78 Cầu Giấy, Hà Nội", "0234516247"),
("Phạm Thị Hồng", "89 Đại La, Hà Nội", "0234516248"),
("Vũ Thanh Hà", "32 Lạc Long Quân, Hà Nội", "0234516249"),
("Trần Thị Lan", "11 Trung Kính, Hà Nội", "0234516250");

INSERT INTO hang_hoa (name, price, img_url) 
VALUES
("Chuối", 15000, "/bucket/image/hang_hoa/chuoi.png"),
("Bưởi", 30000, "/bucket/image/hang_hoa/buoi.png"),
("Na", 40000, "/bucket/image/hang_hoa/na.png"),
("Nước mắm", 25000, "/bucket/image/hang_hoa/nuocmam.png"),
("Gà", 120000, "/bucket/image/hang_hoa/ga.png"),
("Lươn", 200000, "/bucket/image/hang_hoa/luon.png"),
("Thịt lợn", 100000, "/bucket/image/hang_hoa/thitlon.png"),
("Khế", 20000, "/bucket/image/hang_hoa/khe.png"),
("Thịt bò", 250000, "/bucket/image/hang_hoa/thitbo.png"),
("Bim bim Lays", 12000, "/bucket/image/hang_hoa/lays.png"),
("Táo", 50000, "/bucket/image/hang_hoa/tao.png"),
("Nho", 60000, "/bucket/image/hang_hoa/nho.png"),
("Dưa hấu", 35000, "/bucket/image/hang_hoa/duahau.png"),
("Xoài", 45000, "/bucket/image/hang_hoa/xoai.png"),
("Cà chua", 25000, "/bucket/image/hang_hoa/cachua.png"),
("Cải xanh", 15000, "/bucket/image/hang_hoa/caixanh.png"),
("Bắp cải", 20000, "/bucket/image/hang_hoa/bapcai.png"),
("Khoai tây", 30000, "/bucket/image/hang_hoa/khoaitay.png"),
("Khoai lang", 25000, "/bucket/image/hang_hoa/khoailang.png"),
("Hành tím", 40000, "/bucket/image/hang_hoa/hanhtim.png"),
("Tỏi", 50000, "/bucket/image/hang_hoa/toi.png"),
("Bánh mì", 10000, "/bucket/image/hang_hoa/banhmi.png"),
("Bánh tráng", 30000, "/bucket/image/hang_hoa/banhtrang.png"),
("Kem", 15000, "/bucket/image/hang_hoa/kem.png"),
("Nước ngọt", 12000, "/bucket/image/hang_hoa/nuocngot.png"),
("Trà xanh", 10000, "/bucket/image/hang_hoa/traxanh.png"),
("Cà phê", 35000, "/bucket/image/hang_hoa/caphe.png");
