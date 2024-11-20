// Example customer data
var customers = [];

var trashCustomers = [];

var classifies = [];

var operationId;

var currentPage = 1;

var pageSize = 10;

var globalCatagory = "Tất Cả";

var globalSearchName = "";

function loadClassifies() {
  fetch("../php/api_get.php?action=getClassifies")
    .then((response) => response.json())
    .then((data) => {
      console.log("calssifies: ", data);
      classifies = data;
      const groupList = document.getElementById("groupList");
      groupList.innerHTML = "";

      const optionAll = document.createElement("li");
      optionAll.classList.add("list-group-item");
      optionAll.id = "groupList";
      optionAll.setAttribute("data-category", "Tất Cả");
      optionAll.textContent = "Tất Cả";

      groupList.appendChild(optionAll);

      classifies.forEach((group) => {
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
          findCustomersByClassify(category);
        });
      });
    });
}

function addClassify() {
  const name = document.getElementById("groupName").value;
  const discount = document.getElementById("groupDiscount").value;

  if (name && discount) {
    const newClassify = new FormData();
    newClassify.append("name", name);
    newClassify.append("discount", discount);

    fetch("../php/api_post.php?action=createClassify", {
      method: "POST",
      body: newClassify,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
          loadClassifies();
        } else {
          alert(data.error + ", " + data.details);
        }
      });
    // Đóng modal sau khi lưu
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addCategoryModal")
    );
    modal.hide();
    // Reset form
    document.getElementById("categoryForm").reset();
  } else {
    alert("Vui lòng nhập đủ thông tin.");
  }
}

function loadCustomers() {
  const customerTable = document.getElementById("customer-table");
  customerTable.innerHTML = "";

  fetch(
    `../php/api_get.php?action=getCustomers&page=${currentPage}&limit=${pageSize}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("loadCustomers: ", data);
      customers = [];
      customers = data.customers;
      customers.forEach((customer) => {
        const row = document.createElement("tr");
        let classify = classifies.find(
          (element) => element.id === customer.classify_id
        );
        row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>${customer.phoneNum}</td>
            <td>${classify.name}</td>
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

      createPagination(Number(data.total));

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
      ).innerText = `Tìm thấy ${data.total} kết quả.`;
    });
}

function createPagination(total) {
  const totalPages = Math.ceil(total / pageSize);
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  if (total != 0) {
    // Nút "Previous"
    const prevButton = document.createElement("li");
    prevButton.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
    prevButton.innerHTML = `
    <a class="page-link" href="#" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>`;
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        if (globalCatagory != "Tất Cả") {
          findCustomersByClassify(globalCatagory);
        } else {
          loadCustomers();
        }
      }
    });
    pagination.appendChild(prevButton);

    // Nút số trang
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("li");
      pageButton.className = `page-item ${i === currentPage ? "active" : ""}`;
      pageButton.innerHTML = `<a class="page-link" href="#">${i}</a>`;
      pageButton.addEventListener("click", () => {
        currentPage = i;
        if (globalCatagory != "Tất Cả") {
          findCustomersByClassify(globalCatagory);
        } else {
          loadCustomers();
        }
      });
      pagination.appendChild(pageButton);
    }

    // Nút "Next"
    const nextButton = document.createElement("li");
    nextButton.className = `page-item ${
      currentPage === totalPages ? "disabled" : ""
    }`;
    nextButton.innerHTML = `
    <a class="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>`;
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        if (globalCatagory != "Tất Cả") {
          findCustomersByClassify(globalCatagory);
        } else {
          loadCustomers();
        }
      }
    });
    pagination.appendChild(nextButton);
  }
}

function findCustomersByClassify(category) {
  const customerTable = document.getElementById("customer-table");
  customerTable.innerHTML = "";

  globalCatagory = category;

  if (category != "Tất Cả") {
    let classify = classifies.find((element) => element.name === category);

    fetch(
      `../php/api_get.php?action=findCustomersByClassify&classify_id=${classify.id}&page=${currentPage}&limit=${pageSize}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("findCustomersByClassify: ", data);
        customers = [];
        customers = data.customers;
        customers.forEach((customer) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td><input type="checkbox" class="row-checkbox"></td>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>${customer.phoneNum}</td>
            <td>${classify.name}</td>
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

        createPagination(Number(data.total));

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
        ).innerText = `Tìm thấy ${data.total} kết quả.`;
      });
  } else {
    currentPage = 1;
    loadCustomers();
  }
}

function findCustomerByName() {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const customerTable = document.getElementById("customer-table");
  customerTable.innerHTML = "";

  
}

// function openConfirmMoveToTrash() {
//   const modalElement = document.getElementById("confirmMoveToTrashModal");
//   const modal = new bootstrap.Modal(modalElement);
//   modal.show();
// }

// function moveToTrash() {
//   const selectAllCheckbox = document.getElementById("select-all");
//   if (selectAllCheckbox.checked) {
//     trashCustomers = trashCustomers.concat(customers);
//     customers.length = 0;
//     // Sau khi xóa, ẩn modal
//     const confirmModal = bootstrap.Modal.getInstance(
//       document.getElementById("confirmMoveToTrashModal")
//     );
//     confirmModal.hide();
//     localStorage.setItem("customers", JSON.stringify(customers));
//     localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));
//     loadCustomers();
//     return;
//   }

//   const rowCheckboxes = document.querySelectorAll(".row-checkbox");
//   rowCheckboxes.forEach((checkbox) => {
//     if (checkbox.checked) {
//       const row = checkbox.closest("tr");
//       const id = row.cells[1].textContent.trim();
//       const index = customers.findIndex((customer) => customer.id === id);
//       if (index != -1) {
//         const removedCustomer = customers.splice(index, 1)[0];
//         trashCustomers.push(removedCustomer);
//       }
//     }
//   });

//   localStorage.setItem("customers", JSON.stringify(customers));
//   localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

//   // Sau khi xóa, ẩn modal
//   const confirmModal = bootstrap.Modal.getInstance(
//     document.getElementById("confirmMoveToTrashModal")
//   );
//   confirmModal.hide();

//   loadCustomers();
// }

// function openAddCustomer() {
//   const modalElement = document.getElementById("addCustomerModal");
//   const modal = new bootstrap.Modal(modalElement); // Khởi tạo modal

//   const groupList = document.getElementById("customerGroup");
//   groupList.innerHTML = "";

//   groups.forEach((group) => {
//     const option = document.createElement("option");
//     option.value = group.name;
//     option.textContent = group.name;
//     groupList.appendChild(option);
//   });
//   modal.show(); // Hiển thị modal
// }

// function saveCustomer() {
//   // Lấy dữ liệu từ các trường nhập
//   const group = document.getElementById("customerGroup").value;
//   const id = document.getElementById("customerId").value;
//   const name = document.getElementById("customerName").value;
//   const phone = document.getElementById("customerPhone").value;
//   const address = document.getElementById("customerAddress").value;

//   // Kiểm tra dữ liệu hợp lệ
//   if (group && id && name && phone && address) {
//     const newCustomer = {
//       id,
//       name,
//       address,
//       phone,
//       group,
//     };

//     customers.push(newCustomer); // Thêm khách hàng vào mảng
//     loadCustomers();
//     // console.log(customers);

//     // Đóng modal sau khi lưu
//     const modal = bootstrap.Modal.getInstance(
//       document.getElementById("addCustomerModal")
//     );
//     modal.hide();
//     localStorage.setItem("customers", JSON.stringify(customers));
//     // Reset form
//     document.getElementById("customerForm").reset();
//   } else {
//     alert("Vui lòng nhập đầy đủ thông tin.");
//   }
// }

// var editCustomerModal = document.getElementById("editCustomerModal");
// editCustomerModal.addEventListener("show.bs.modal", function(e) {
//   let button = e.relatedTarget;
//   operationId = button.getAttribute("data-customer-id");
//   const idx = customers.findIndex((customer) => customer.id === operationId);
//   if(idx != -1) {
//     const groupList = document.getElementById("editCustomerGroup");
//     groupList.innerHTML = "";
//     groups.forEach((group) => {
//       const option = document.createElement("option");
//       option.value = group.name;
//       option.textContent = group.name;
//       groupList.appendChild(option);
//     });

//     document.getElementById("editCustomerGroup").value = customers[idx].group;
//     document.getElementById("editCustomerId").value = customers[idx].id;
//     document.getElementById("editCustomerName").value = customers[idx].name;
//     document.getElementById("editCustomerPhone").value = customers[idx].phone;
//     document.getElementById("editCustomerAddress").value = customers[idx].address;
//   }
// });

// function editCustomer() {
//   const group = document.getElementById("editCustomerGroup").value;
//   const id = document.getElementById("editCustomerId").value;
//   const name = document.getElementById("editCustomerName").value;
//   const phone = document.getElementById("editCustomerPhone").value;
//   const address = document.getElementById("editCustomerAddress").value;

//   // Kiểm tra dữ liệu hợp lệ
//   if (group && id && name && phone && address) {
//     const editCustomer = {
//       id,
//       name,
//       address,
//       phone,
//       group,
//     };

//     const idx = customers.findIndex((customer) => customer.id === editCustomer.id);
//     customers[idx] = editCustomer;
//     loadCustomers();

//     // Đóng modal sau khi lưu
//     const modal = bootstrap.Modal.getInstance(
//       document.getElementById("editCustomerModal")
//     );
//     modal.hide();
//     localStorage.setItem("customers", JSON.stringify(customers));
//     // Reset form
//     document.getElementById("editCustomerForm").reset();
//   } else {
//     alert("Vui lòng nhập đầy đủ thông tin.");
//   }
// }

// var deleteCustomerModal = document.getElementById("deleteCustomerModal");
// deleteCustomerModal.addEventListener("show.bs.modal", function (event) {
//   let button = event.relatedTarget;
//   operationId = button.getAttribute("data-customer-id");
//   var modalBodySpan = document.getElementById("operationDeleteId");
//   modalBodySpan.textContent = operationId;
// });
// function deleteCustomer() {
//   const index = customers.findIndex(
//     (customer) => customer.id === operationId
//   );
//   if (index != -1) {
//     const deleteCustomer = customers.splice(index, 1)[0];
//     trashCustomers.push(deleteCustomer);
//   }
//   localStorage.setItem("customers", JSON.stringify(customers));
//   localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

//   const modal = bootstrap.Modal.getInstance(
//     document.getElementById("deleteCustomerModal")
//   );
//   modal.hide();
//   loadCustomers();
// }

// function importExcel() {
//   const fileInput = document.getElementById("fileInput");
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Vui lòng chọn một file Excel.");
//     return;
//   }

//   const reader = new FileReader();
//   reader.onload = function (e) {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: "array" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     // Chuyển đổi sheet sang JSON
//     const rows = XLSX.utils.sheet_to_json(sheet);
//     customers = customers.concat(rows);
//     loadCustomers();

//     localStorage.setItem("customers", JSON.stringify(customers));

//     // Ẩn modal sau khi nhập file
//     const modal = bootstrap.Modal.getInstance(
//       document.getElementById("excelModal")
//     );
//     modal.hide();
//   };

//   reader.readAsArrayBuffer(file);
//   document.getElementById("fileInput").value = "";
// }

// function exportExcel() {
//   // Lấy bảng dữ liệu mà bỏ qua cột cuối
//   const table = document.getElementById("customerTable");
//   const rows = [];
//   const headers = ["id", "name", "address", "phone", "group"];

//   // Lấy các hàng trong bảng
//   const tbody = table.querySelector("tbody");
//   const trElements = tbody.querySelectorAll("tr");

//   // Lấy dữ liệu từ các hàng, bỏ qua cột "Chức năng"
//   trElements.forEach((tr) => {
//     const cells = tr.querySelectorAll("td");
//     const row = [
//       cells[1]?.innerText,
//       cells[2]?.innerText,
//       cells[3]?.innerText,
//       cells[4]?.innerText,
//       cells[5]?.innerText,
//     ];
//     rows.push(row);
//   });

//   const worksheetData = [headers, ...rows];

//   // Tạo workbook và worksheet từ dữ liệu
//   const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

//   // Xuất file Excel
//   XLSX.writeFile(workbook, "customer_data.xlsx");
// }

// function trashPage() {
//   window.location.href = "trashCustomers.html";
// }

window.onload = function () {
  loadClassifies();
  loadCustomers();
};
