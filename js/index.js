// Example customer data
var customers = [];

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

      //load classifies truoc khi load customer vì load customer sử dụng data classifies
      loadCustomers();
      const groupList = document.getElementById("groupList");
      groupList.innerHTML = "";

      const optionAll = document.createElement("li");
      optionAll.classList.add("list-group-item");
      optionAll.id = "groupList";
      optionAll.setAttribute("data-category", "Tất Cả");
      optionAll.textContent = "Tất Cả";
      optionAll.classList.add("active");

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
          findCustomers(category);
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
    `../php/api_get.php?action=getCustomers&name=${globalSearchName}&page=${currentPage}&limit=${pageSize}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("loadCustomers: ", data);
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
          findCustomers(globalCatagory);
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
          findCustomers(globalCatagory);
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
          findCustomers(globalCatagory);
        } else {
          loadCustomers();
        }
      }
    });
    pagination.appendChild(nextButton);
  }
}

function findCustomers(category) {
  const searchValue = document.getElementById("search").value.toLowerCase();
  const customerTable = document.getElementById("customer-table");
  customerTable.innerHTML = "";

  globalSearchName = searchValue;

  if (category != null) {
    globalCatagory = category;
  }

  if (globalCatagory != "Tất Cả") {
    let classify = classifies.find(
      (element) => element.name === globalCatagory
    );

    fetch(
      `../php/api_get.php?action=findCustomers&classify_id=${classify.id}&name=${searchValue}&page=${currentPage}&limit=${pageSize}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("findCustomers: ", data);
        customers = data.customers;
        customers.forEach((customer) => {
          if (Number(customer.active) === 1) {
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
          }
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

function openAddCustomer() {
  const modalElement = document.getElementById("addCustomerModal");
  const modal = new bootstrap.Modal(modalElement); // Khởi tạo modal

  const groupList = document.getElementById("customerGroup");
  groupList.innerHTML = "";

  classifies.forEach((group) => {
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
  const name = document.getElementById("customerName").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;
  const userName = document.getElementById("customerUserName").value;
  const password = document.getElementById("customerPassword").value;

  // Kiểm tra dữ liệu hợp lệ
  if (group && name && phone && address && userName && password) {
    let classifyID = classifies.find((x) => x.name === group).id;
    const newCustomer = new FormData();
    newCustomer.append("classifyID", classifyID);
    newCustomer.append("name", name);
    newCustomer.append("phone", phone);
    newCustomer.append("address", address);
    newCustomer.append("userName", userName);
    newCustomer.append("password", password);

    // console.log(customers);

    fetch(`../php/api_post.php?action=createCustomer`, {
      method: "POST",
      body: newCustomer,
    })
      .then((response) => response.json())
      .then((data) => {
        // Đóng modal sau khi lưu
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("addCustomerModal")
        );
        modal.hide();
        // Reset form
        document.getElementById("customerForm").reset();
        if (data.success) {
          window.onload();
        } else {
          alert(data.error + ` ${data.details}`);
        }
      });
  } else {
    alert("Vui lòng nhập đầy đủ thông tin.");
  }
}

var editCustomerModal = document.getElementById("editCustomerModal");
editCustomerModal.addEventListener("show.bs.modal", function (e) {
  let button = e.relatedTarget;
  operationId = button.getAttribute("data-customer-id");
  const idx = customers.findIndex((customer) => customer.id === operationId);
  if (idx != -1) {
    const groupList = document.getElementById("editCustomerCategory");
    groupList.innerHTML = "";
    classifies.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.name;
      option.textContent = group.name;
      groupList.appendChild(option);
    });

    console.log("customers[idx]: ", customers[idx]);

    let classify = classifies.find((x) => x.id === customers[idx].classify_id);

    console.log("classify: ", classify);

    document.getElementById("editCustomerCategory").value = classify.name;
    document.getElementById("editCustomerName").value = customers[idx].name;
    document.getElementById("editCustomerPhone").value =
      customers[idx].phoneNum;
    document.getElementById("editCustomerAddress").value =
      customers[idx].address;
    document.getElementById("editCustomerUserName").value =
      customers[idx].user_name;
    document.getElementById("editCustomerPassword").value = "";
  }
});

function editCustomer() {
  const group = document.getElementById("editCustomerCategory").value;
  const name = document.getElementById("editCustomerName").value;
  const phone = document.getElementById("editCustomerPhone").value;
  const address = document.getElementById("editCustomerAddress").value;
  const userName = document.getElementById("editCustomerUserName").value;
  const password = document.getElementById("editCustomerPassword").value;

  // Kiểm tra dữ liệu hợp lệ
  if (operationId && group && name && phone && address && userName) {
    let classifyID = classifies.find((x) => x.name === group).id;
    const updateCustomer = new FormData();
    updateCustomer.append("id", operationId);
    updateCustomer.append("classifyID", classifyID);
    updateCustomer.append("name", name);
    updateCustomer.append("phone", phone);
    updateCustomer.append("address", address);
    updateCustomer.append("userName", userName);
    updateCustomer.append("password", password);

    fetch(`../php/api_post.php?action=updateCustomer`, {
      method: "POST",
      body: updateCustomer,
    })
      .then((response) => response.json())
      .then((data) => {
        
        // Reset form
        document.getElementById("editCustomerForm").reset();

        if (data.success) {
          window.onload();
        } else {
          alert(data.error + ` ${data.details}`);
        }
      })
      .catch((e) => console.error("Error: ", e));
  } else {
    alert("Vui lòng nhập đầy đủ thông tin.");
  }
}

function moveToTrash() {
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox.checked) {
    fetch(`../php/api_patch.php?action=deactivateAllCustomers`)
      .then((response) => response.json())
      .then((data) => {
        const confirmModal = bootstrap.Modal.getInstance(
          document.getElementById("confirmMoveToTrashModal")
        );
        confirmModal.hide();

        if (data.success) {
          window.onload();
        } else {
          alert(data.error + ` ${data.details}`);
          return;
        }
      });
  }

  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  const deactivateCustomerIds = [];
  rowCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const id = row.cells[1].textContent.trim();
      const index = customers.findIndex((customer) => customer.id === id);
      if (index != -1) {
        deactivateCustomerIds.push(id);
      }
    }
  });

  // chuyển mảng id thành chuỗi phân tác bằng dấu phẩy để gửi qua BE
  const idsString = deactivateCustomerIds.join(',');

  fetch(`../php/api_patch.php?action=deactivateCustomers&ids=${idsString}`)
    .then((response) => response.json())
    .then((data) => {
      const confirmModal = bootstrap.Modal.getInstance(
        document.getElementById("confirmMoveToTrashModal")
      );
      confirmModal.hide();

      if(data.success) {
        window.onload();
      } else {
        alert(`${data.error} ${data.details}`);
      }
    });
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
    fetch(`../php/api_patch.php?action=deactivateCustomer&id=${operationId}`)
      .then((response) => response.json())
      .then((data) => {
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("deleteCustomerModal")
        );
        modal.hide();
        if(data.success) {
          window.onload();
        } else {
          alert(`${data.error} ${data.details}`);
        }
      });
  } else {
    alert(`Không tìm thấy id: ${operationId}`);
  }

}

function trashPage() {
  window.location.href = "../php/trashCustomer.php";
}

window.onload = function () {
  loadClassifies();
};
