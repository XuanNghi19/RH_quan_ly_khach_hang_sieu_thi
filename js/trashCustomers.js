customers = JSON.parse(localStorage.getItem("customers")) || [];
trashCustomers = JSON.parse(localStorage.getItem("trashCustomers")) || [];

function loadTrashCustomers() {
  const trashCustomerTable = document.getElementById("trash-customer-table");
  trashCustomerTable.innerHTML = "";

  trashCustomers.forEach((customer) => {
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
              data-bs-target="#restoreCustomersModal"
            >Phục hồi</button>
            <button 
              class="btn btn-sm btn-danger" 
              data-customer-id='${customer.id}'
              data-bs-toggle="modal"
              data-bs-target="#destroyCustomersModal"
            >
              Xóa
            </button>
          </td>
      `;

    trashCustomerTable.appendChild(row);
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
}

function restoreManyCustomers() {
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox.checked) {
    customers = customers.concat(trashCustomers);
    trashCustomers.length = 0;
    // Sau khi xóa, ẩn modal
    const confirmModal = bootstrap.Modal.getInstance(
      document.getElementById("restoreManyCustomers")
    );
    confirmModal.hide();
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));
    loadTrashCustomers();
    return;
  }

  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  rowCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const id = row.cells[1].textContent.trim();
      const index = trashCustomers.findIndex((customer) => customer.id === id);
      if (index != -1) {
        const restoreCustomer = trashCustomers.splice(index, 1)[0];
        customers.push(restoreCustomer);
      }
    }
  });

  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

  // Sau khi xóa, ẩn modal
  const confirmModal = bootstrap.Modal.getInstance(
    document.getElementById("restoreManyCustomers")
  );
  confirmModal.hide();

  loadTrashCustomers();
}

function destroyMannyCustomers() {
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox.checked) {
    trashCustomers.length = 0;
    // Sau khi xóa, ẩn modal
    const confirmModal = bootstrap.Modal.getInstance(
      document.getElementById("destroyMannyCustomersModal")
    );
    confirmModal.hide();
    localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));
    loadTrashCustomers();
    return;
  }

  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  rowCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const id = row.cells[1].textContent.trim();
      const index = trashCustomers.findIndex((customer) => customer.id === id);
      if (index != -1) {
        trashCustomers.splice(index, 1);
      }
    }
  });

  localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

  // Sau khi xóa, ẩn modal
  const confirmModal = bootstrap.Modal.getInstance(
    document.getElementById("destroyMannyCustomersModal")
  );
  confirmModal.hide();

  loadTrashCustomers();
}

var restoreCustomersModal = document.getElementById("restoreCustomersModal");
restoreCustomersModal.addEventListener("show.bs.modal", function (event) {
  var button = event.relatedTarget;
  operationId = button.getAttribute("data-customer-id");
  var modalBodySpan = document.getElementById("operationId");
  modalBodySpan.textContent = operationId;
});
function restoreCustomer() {
  const index = trashCustomers.findIndex(
    (customer) => customer.id === operationId
  );
  if (index != -1) {
    const restoreCustomer = trashCustomers.splice(index, 1)[0];
    customers.push(restoreCustomer);
  }
  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("restoreCustomersModal")
  );
  modal.hide();
  loadTrashCustomers();
}

var destroyCustomersModal = document.getElementById("destroyCustomersModal");
destroyCustomersModal.addEventListener("show.bs.modal", function (event) {
  var btn = event.relatedTarget;
  operationId = btn.getAttribute("data-customer-id");
  var modalBodySpan = document.getElementById("operationDestroyId");
  modalBodySpan.textContent = operationId;
});
function destroyCustomer() {
  const index = trashCustomers.findIndex(
    (customer) => customer.id === operationId
  );
  if (index != -1) {
    trashCustomers.splice(index, 1);
  }
  localStorage.setItem("trashCustomers", JSON.stringify(trashCustomers));

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("destroyCustomersModal")
  );
  modal.hide();
  loadTrashCustomers();
}

function indexPage() {
  window.location.href = "index.html";
}

window.onload = function () {
  loadTrashCustomers();
};
