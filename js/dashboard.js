fetch("../php/api_get.php?action=getCustomerStats")
  .then((response) => response.json())
  .then((data) => {
    console.log("getCustomerStats: ", data);
    // Khách hàng mua nhiều nhất
    const topCustomer = data.top_customer;
    document.getElementById("topCustomer").innerText = topCustomer.name || "-";
    document.getElementById(
      "topCustomerDetails"
    ).innerText = `Đã mua: ${numFormater(Number(topCustomer.total_spent))} VND`;
    document
      .getElementById("topCustomerAvatar")
      .setAttribute(
        "src",
        topCustomer.avatar_url || "../bucket/image/avatar/default-avatar.jpg"
      );

    // Khách hàng hủy đơn nhiều nhất
    const mostCancelledCustomer = data.most_cancelled_customer;
    document.getElementById("mostCancelledCustomer").innerText =
      mostCancelledCustomer.name || "-";
    document.getElementById(
      "mostCancelledDetails"
    ).innerText = `Hủy ${mostCancelledCustomer.cancel_count} đơn hàng`;
    document
      .getElementById("mostCancelledAvatar")
      .setAttribute(
        "src",
        mostCancelledCustomer.avatar_url || "../bucket/image/avatar/default-avatar.jpg"
      );

    // Khách hàng mới nhất
    const newestCustomer = data.newest_customer;
    document.getElementById("newestCustomer").innerText =
      newestCustomer.name || "-";
    document.getElementById(
      "newestCustomerDetails"
    ).innerText = `Đã tham gia: ${new Date(
      newestCustomer.join_date
    ).toLocaleDateString("vi-VN")}`;
    document
      .getElementById("newestCustomerAvatar")
      .setAttribute(
        "src",
        newestCustomer.avatar_url || "../bucket/image/avatar/default-avatar.jpg"
      );
  })
  .catch((error) => console.error("Error: ", error));

fetch("../php/api_get.php?action=getDoanhThuChart")
  .then((response) => response.json())
  .then((data) => {
    console.log("Doanh thu: ", data);

    // Lấy tháng và doanh thu từ dữ liệu trả về
    const months = data.map((item) => item.thang); // Lấy tất cả các tháng
    const revenue = data.map((item) => parseFloat(item.doanh_thu)); // Lấy tổng doanh thu của từng tháng

    // Vẽ biểu đồ
    const ctxDeposit = document.getElementById("depositChart").getContext("2d");
    const totalIncome = document.getElementById("totalIncome");
    totalIncome.innerText =
      numFormater(revenue.reduce((acc, crr) => acc + crr, 0)) + " VND";
    new Chart(ctxDeposit, {
      type: "line", // Chọn loại biểu đồ là đường
      data: {
        labels: months, // Dữ liệu nhãn cho các tháng
        datasets: [
          {
            label: "Doanh thu",
            data: revenue, // Dữ liệu doanh thu
            backgroundColor: "rgba(54, 162, 235, 0.2)", // Màu nền
            borderColor: "rgba(54, 162, 235, 1)", // Màu đường viền
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
        },
      },
    });
  })
  .catch((error) => console.error("Error: ", error));

fetch("../php/api_get.php?action=getHangHoaChart")
  .then((response) => response.json())
  .then((data) => {
    console.log("Hàng hóa: ", data);
    const ctxGoods = document.getElementById("goodsChart").getContext("2d");
    new Chart(ctxGoods, {
      type: "doughnut",
      data: {
        labels: ["Hàng hóa bán chạy", "Hàng hóa tồn kho", "Hàng hóa hết hàng"],
        datasets: [
          {
            data: [data.ban_chay, data.ton_kho, data.het_hang],
            backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          duration: 1000,
        },
      },
    });
  })
  .catch((error) => console.error("Error: ", error));

fetch("../php/api_get.php?action=getChiTieuChart")
  .then((response) => response.json())
  .then((data) => {
    console.log("Chi tiêu: ", data);
    const months = data.map((item) => item.thang);
    const spending = data.map((item) => parseFloat(item.chi_tieu));
    const totalsSpend = document.getElementById("totalsSpend");
    totalsSpend.innerText =
      numFormater(spending.reduce((acc, crr) => acc + crr, 0)) + " VND";

    const ctxExpenses = document
      .getElementById("expensesChart")
      .getContext("2d");
    new Chart(ctxExpenses, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Chi tiêu",
            data: spending,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
        },
      },
    });
  })
  .catch((error) => console.error("Error: ", error));

fetch("../php/api_get.php?action=getHangHoaStock")
  .then((response) => response.json())
  .then((data) => {
    console.log("total items: ", data);
    const totalStock = document.getElementById("totalStock");
    totalStock.innerText = numFormater(Number(data.total_stock)) + " sản phẩm";
    const totalSold = document.getElementById("totalSold");
    totalSold.innerText = numFormater(Number(data.total_sold));
  })
  .catch((error) => console.error("Error: ", error));

function numFormater(num) {
  return num.toLocaleString("vi-VN");
}
