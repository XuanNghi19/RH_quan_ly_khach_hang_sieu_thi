// Example customer data
var customers = [
  {
    id: "KH001",
    name: "Hoàng Trường Giang",
    address: "Cầu Giấy - Hà Nội",
    phone: "0979686868",
    group: "Khách Quen",
  },
  {
    id: "KH002",
    name: "Nguyễn Văn Anh",
    address: "Hai Bà Trưng - Hà Nội",
    phone: "0987554321",
    group: "Khách Quen",
  },
  {
    id: "KH003",
    name: "Trần Thị Thu Hương",
    address: "Thanh Xuân - Hà Nội",
    phone: "0912345678",
    group: "Khách Mới",
  },
  {
    id: "KH004",
    name: "Lê Minh Đức",
    address: "Đống Đa - Hà Nội",
    phone: "0923456789",
    group: "Khách VIP",
  },
  {
    id: "KH005",
    name: "Phạm Hải Nam",
    address: "Hoàn Kiếm - Hà Nội",
    phone: "0934567890",
    group: "Khách Quen",
  },
  {
    id: "KH006",
    name: "Đặng Thùy Linh",
    address: "Tây Hồ - Hà Nội",
    phone: "0945678901",
    group: "Khách Mới",
  },
  {
    id: "KH007",
    name: "Ngô Quốc Bảo",
    address: "Long Biên - Hà Nội",
    phone: "0956789012",
    group: "Khách VIP",
  },
  {
    id: "KH008",
    name: "Vũ Văn Tú",
    address: "Ba Đình - Hà Nội",
    phone: "0967890123",
    group: "Khách Quen",
  },
  {
    id: "KH009",
    name: "Lý Thị Hạnh",
    address: "Hoàng Mai - Hà Nội",
    phone: "0978901234",
    group: "Khách Mới",
  },
  {
    id: "KH010",
    name: "Đỗ Anh Dũng",
    address: "Gia Lâm - Hà Nội",
    phone: "0989012345",
    group: "Khách VIP",
  },
];


var trashCustomers = [];

var groups = [
  {
    name: "Loại Mặc Định",
    description: "Khách hàng mặc định",
  },
  {
    name: "Khách Quen",
    description: "Khách mua nhiều hàng",
  },
];

var operationId;

// localStorage.setItem("customers", JSON.stringify(customers));
// localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));
// localStorage.setItem("groups", JSON.stringify(groups));

customers = JSON.parse(localStorage.getItem("customers")) || [];
trashCustomers = JSON.parse(localStorage.getItem("trashCustomers")) || [];
groups = JSON.parse(localStorage.getItem("groups")) || [];

function loadGroups() {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = "";

  const optionAll = document.createElement("li");
  optionAll.classList.add("list-group-item");
  optionAll.id = "groupList";
  optionAll.setAttribute("data-category", "Tất Cả");
  optionAll.textContent = "Tất Cả";

  groupList.appendChild(optionAll);

  groups.forEach((group) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.id = "groupList";
    li.setAttribute("data-category", group.name);
    li.textContent = group.name;

    groupList.appendChild(li);
  });

  const categoryListItems = document.querySelectorAll(
    "#groupList .list-group-item"
  );

  categoryListItems.forEach((item) => {
    item.addEventListener("click", function () {
      categoryListItems.forEach((li) => li.classList.remove("active"));

      this.classList.add("active");

      const category = this.getAttribute("data-category");
      filterCustomers(category);
    });
  });

  filterCustomers("Tất Cả");
}

function loadCustomers() {
  const customerTable = document.getElementById("customer-table");
  customerTable.innerHTML = "";

  customers.forEach((customer) => {
    const row = document.createElement("tr");

    row.innerHTML = `
          <td><input type="checkbox" class="row-checkbox"></td>
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${customer.address}</td>
          <td>${customer.phone}</td>
          <td>${customer.group}</td>
          <td>
            <button 
              class="btn btn-sm btn-warning" 
              data-customer-id='${customer.id}' 
              data-bs-toggle="modal" 
              data-bs-target="#editCustomerModal"
            >
              Sửa
            </button>
            <button 
              class="btn btn-sm btn-danger" 
              data-customer-id='${customer.id}' 
              data-bs-toggle="modal" 
              data-bs-target="#deleteCustomerModal"
            >
              Xóa
            </button>
          </td>
      `;

    customerTable.appendChild(row);
  });

  const selectAllCheckbox = document.getElementById("select-all");

  const rowCheckboxes = document.querySelectorAll(".row-checkbox");

  // Gán sự kiện thay đổi cho checkbox ở <th>
  selectAllCheckbox.addEventListener("change", function () {
    // Duyệt qua tất cả các checkbox trong tbody và đặt trạng thái tương ứng với selectAllCheckbox
    rowCheckboxes.forEach(function (checkbox) {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  // Gán sự kiện thay đổi cho mỗi checkbox trong phần tbody để cập nhật trạng thái của selectAllCheckbox
  rowCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      // Kiểm tra nếu tất cả các checkbox trong tbody đều được đánh dấu
      const allChecked = Array.from(rowCheckboxes).every(function (cb) {
        return cb.checked;
      });

      // Nếu tất cả đều được đánh dấu thì checkbox "select-all" cũng được đánh dấu, ngược lại thì bỏ đánh dấu
      selectAllCheckbox.checked = allChecked;
    });
  });

  document.getElementById(
    "result-count"
  ).innerText = `Tìm thấy ${customers.length} kết quả.`;
}

function filterCustomers(category) {
  const tableBody = document.getElementById("customer-table");
  tableBody.innerHTML = ""; // Xóa nội dung bảng trước khi thêm mới

  const filteredCustomers = customers.filter(
    (customer) => category === "Tất Cả" || customer.group === category
  );

  filteredCustomers.forEach((customer) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td><input type="checkbox" class="row-checkbox"></td>
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${customer.address}</td>
          <td>${customer.phone}</td>
          <td>${customer.group}</td>
          <td>
            <button 
              class="btn btn-sm btn-warning" 
              data-customer-id='${customer.id}' 
              data-bs-toggle="modal" 
              data-bs-target="#editCustomerModal"
            >
              Sửa
            </button>
            <button 
              class="btn btn-sm btn-danger" 
              data-customer-id='${customer.id}' 
              data-bs-toggle="modal" 
              data-bs-target="#deleteCustomerModal"
            >
              Xóa
            </button>
          </td>
      `;
    tableBody.appendChild(row);
  });

  // Lấy checkbox ở phần <th>
  const selectAllCheckbox = document.getElementById("select-all");

  // Lấy tất cả các checkbox ở phần <tbody>
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");

  // Gán sự kiện thay đổi cho checkbox ở <th>
  selectAllCheckbox.addEventListener("change", function () {
    // Duyệt qua tất cả các checkbox trong tbody và đặt trạng thái tương ứng với selectAllCheckbox
    rowCheckboxes.forEach(function (checkbox) {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  // Gán sự kiện thay đổi cho mỗi checkbox trong phần tbody để cập nhật trạng thái của selectAllCheckbox
  rowCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      // Kiểm tra nếu tất cả các checkbox trong tbody đều được đánh dấu
      const allChecked = Array.from(rowCheckboxes).every(function (cb) {
        return cb.checked;
      });

      // Nếu tất cả đều được đánh dấu thì checkbox "select-all" cũng được đánh dấu, ngược lại thì bỏ đánh dấu
      selectAllCheckbox.checked = allChecked;
    });
  });

  document.getElementById(
    "result-count"
  ).textContent = `Tìm thấy ${filteredCustomers.length} kết quả.`;
}

function openConfirmMoveToTrash() {
  const modalElement = document.getElementById("confirmMoveToTrashModal");
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

function moveToTrash() {
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox.checked) {
    trashCustomers = trashCustomers.concat(customers);
    customers.length = 0;
    // Sau khi xóa, ẩn modal
    const confirmModal = bootstrap.Modal.getInstance(
      document.getElementById("confirmMoveToTrashModal")
    );
    confirmModal.hide();
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));
    loadCustomers();
    return;
  }

  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  rowCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const id = row.cells[1].textContent.trim();
      const index = customers.findIndex((customer) => customer.id === id);
      if (index != -1) {
        const removedCustomer = customers.splice(index, 1)[0];
        trashCustomers.push(removedCustomer);
      }
    }
  });

  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

  // Sau khi xóa, ẩn modal
  const confirmModal = bootstrap.Modal.getInstance(
    document.getElementById("confirmMoveToTrashModal")
  );
  confirmModal.hide();

  loadCustomers();
}

function searchCustomer() {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchValue)
  );

  const customerTable = document.getElementById("customer-table");
  customerTable.innerHTML = "";

  filteredCustomers.forEach((customer) => {
    const row = document.createElement("tr");

    row.innerHTML = `
          <td><input type="checkbox" class="row-checkbox"></td>
          <td>${customer.id}</td>
          <td>${customer.name}</td>
          <td>${customer.address}</td>
          <td>${customer.phone}</td>
          <td>${customer.group}</td>
          <td>
            <button 
              class="btn btn-sm btn-warning" 
              data-customer-id='${customer.id}' 
              data-bs-toggle="modal" 
              data-bs-target="#editCustomerModal"
            >
              Sửa
            </button>
            <button 
              class="btn btn-sm btn-danger" 
              data-customer-id='${customer.id}' 
              data-bs-toggle="modal" 
              data-bs-target="#deleteCustomerModal"
            >
              Xóa
            </button>
          </td>
      `;

    customerTable.appendChild(row);
  });

  // Lấy checkbox ở phần <th>
  const selectAllCheckbox = document.getElementById("select-all");

  // Lấy tất cả các checkbox ở phần <tbody>
  const rowCheckboxes = document.querySelectorAll(".row-checkbox");

  // Gán sự kiện thay đổi cho checkbox ở <th>
  selectAllCheckbox.addEventListener("change", function () {
    // Duyệt qua tất cả các checkbox trong tbody và đặt trạng thái tương ứng với selectAllCheckbox
    rowCheckboxes.forEach(function (checkbox) {
      checkbox.checked = selectAllCheckbox.checked;
    });
  });

  // Gán sự kiện thay đổi cho mỗi checkbox trong phần tbody để cập nhật trạng thái của selectAllCheckbox
  rowCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      // Kiểm tra nếu tất cả các checkbox trong tbody đều được đánh dấu
      const allChecked = Array.from(rowCheckboxes).every(function (cb) {
        return cb.checked;
      });

      // Nếu tất cả đều được đánh dấu thì checkbox "select-all" cũng được đánh dấu, ngược lại thì bỏ đánh dấu
      selectAllCheckbox.checked = allChecked;
    });
  });

  document.getElementById(
    "result-count"
  ).innerText = `Tìm thấy ${filteredCustomers.length} kết quả.`;
}

function addGroup() {
  const name = document.getElementById("groupName").value;
  const description = document.getElementById("groupDescription").value;

  if (name && description) {
    const newGroup = {
      name,
      description,
    };
    groups.push(newGroup);
    loadGroups();
    // Đóng modal sau khi lưu
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addCategoryModal")
    );
    modal.hide();
    localStorage.setItem("groups", JSON.stringify(groups));
    // Reset form
    document.getElementById("categoryForm").reset();
  } else {
    alert("Vui lòng nhập đủ thông tin.");
  }
}

function openAddCustomer() {
  const modalElement = document.getElementById("addCustomerModal");
  const modal = new bootstrap.Modal(modalElement); // Khởi tạo modal

  const groupList = document.getElementById("customerGroup");
  groupList.innerHTML = "";

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.name;
    option.textContent = group.name;
    groupList.appendChild(option);
  });
  modal.show(); // Hiển thị modal
}

function saveCustomer() {
  // Lấy dữ liệu từ các trường nhập
  const group = document.getElementById("customerGroup").value;
  const id = document.getElementById("customerId").value;
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;

  // Kiểm tra dữ liệu hợp lệ
  if (group && id && name && phone && address) {
    const newCustomer = {
      id,
      name,
      address,
      phone,
      group,
    };

    customers.push(newCustomer); // Thêm khách hàng vào mảng
    loadCustomers();
    // console.log(customers);

    // Đóng modal sau khi lưu
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addCustomerModal")
    );
    modal.hide();
    localStorage.setItem("customers", JSON.stringify(customers));
    // Reset form
    document.getElementById("customerForm").reset();
  } else {
    alert("Vui lòng nhập đầy đủ thông tin.");
  }
}

var editCustomerModal = document.getElementById("editCustomerModal");
editCustomerModal.addEventListener("show.bs.modal", function(e) {
  let button = e.relatedTarget;
  operationId = button.getAttribute("data-customer-id");
  const idx = customers.findIndex((customer) => customer.id === operationId);
  if(idx != -1) {
    const groupList = document.getElementById("editCustomerGroup");
    groupList.innerHTML = "";
    groups.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.name;
      option.textContent = group.name;
      groupList.appendChild(option);
    });

    document.getElementById("editCustomerGroup").value = customers[idx].group;
    document.getElementById("editCustomerId").value = customers[idx].id;
    document.getElementById("editCustomerName").value = customers[idx].name;
    document.getElementById("editCustomerPhone").value = customers[idx].phone;
    document.getElementById("editCustomerAddress").value = customers[idx].address;
  }
});
function editCustomer() {
  const group = document.getElementById("editCustomerGroup").value;
  const id = document.getElementById("editCustomerId").value;
  const name = document.getElementById("editCustomerName").value;
  const phone = document.getElementById("editCustomerPhone").value;
  const address = document.getElementById("editCustomerAddress").value;

  // Kiểm tra dữ liệu hợp lệ
  if (group && id && name && phone && address) {
    const editCustomer = {
      id,
      name,
      address,
      phone,
      group,
    };

    const idx = customers.findIndex((customer) => customer.id === editCustomer.id);
    customers[idx] = editCustomer;
    loadCustomers();

    // Đóng modal sau khi lưu
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("editCustomerModal")
    );
    modal.hide();
    localStorage.setItem("customers", JSON.stringify(customers));
    // Reset form
    document.getElementById("editCustomerForm").reset();
  } else {
    alert("Vui lòng nhập đầy đủ thông tin.");
  }
}

var deleteCustomerModal = document.getElementById("deleteCustomerModal");
deleteCustomerModal.addEventListener("show.bs.modal", function (event) {
  let button = event.relatedTarget;
  operationId = button.getAttribute("data-customer-id");
  var modalBodySpan = document.getElementById("operationDeleteId");
  modalBodySpan.textContent = operationId;
});
function deleteCustomer() {
  const index = customers.findIndex(
    (customer) => customer.id === operationId
  );
  if (index != -1) {
    const deleteCustomer = customers.splice(index, 1)[0];
    trashCustomers.push(deleteCustomer);
  }
  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("deleteCustomerModal")
  );
  modal.hide();
  loadCustomers();
}

function importExcel() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Vui lòng chọn một file Excel.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Chuyển đổi sheet sang JSON
    const rows = XLSX.utils.sheet_to_json(sheet);
    customers = customers.concat(rows);
    loadCustomers();

    localStorage.setItem("customers", JSON.stringify(customers));

    // Ẩn modal sau khi nhập file
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("excelModal")
    );
    modal.hide();
  };

  reader.readAsArrayBuffer(file);
  document.getElementById("fileInput").value = "";
}

function exportExcel() {
  // Lấy bảng dữ liệu mà bỏ qua cột cuối
  const table = document.getElementById("customerTable");
  const rows = [];
  const headers = ["id", "name", "address", "phone", "group"];

  // Lấy các hàng trong bảng
  const tbody = table.querySelector("tbody");
  const trElements = tbody.querySelectorAll("tr");

  // Lấy dữ liệu từ các hàng, bỏ qua cột "Chức năng"
  trElements.forEach((tr) => {
    const cells = tr.querySelectorAll("td");
    const row = [
      cells[1]?.innerText,
      cells[2]?.innerText,
      cells[3]?.innerText,
      cells[4]?.innerText,
      cells[5]?.innerText,
    ];
    rows.push(row);
  });

  const worksheetData = [headers, ...rows];

  // Tạo workbook và worksheet từ dữ liệu
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Xuất file Excel
  XLSX.writeFile(workbook, "customer_data.xlsx");
}

function trashPage() {
  window.location.href = "trashCustomers.html";
}

window.onload = function () {
  loadGroups();
  loadCustomers();
};
