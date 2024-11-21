var operationId;

var currentPage = 1;

var pageSize = 10;

var classifies = [];

var trashCustomers = [];

function loadTrashCustomers() {
  const trashCustomerTable = document.getElementById("trash-customer-table");
  trashCustomerTable.innerHTML = "";

  fetch("../php/api_get.php?action=getClassifies")
    .then((response) => response.json())
    .then((data) => {
      console.log("calssifies: ", data);
      classifies = data;
      fetch(
        `../php/api_get.php?action=getTrashCustomers&page=${currentPage}&limit=${pageSize}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("loadTrashCustomers: ", data);
          trashCustomers = data.trashCustomers;
          trashCustomers.forEach((customer) => {
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
                  class="btn btn-sm btn-primary"
                  data-customer-id='${customer.id}'
                  data-bs-toggle="modal"
                  data-bs-target="#restoreCustomersModal"
                >
                  Phục hồi
                </button>
              </td>
            `;
            trashCustomerTable.appendChild(row);
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
        loadTrashCustomers();
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
        loadTrashCustomers();
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
        loadTrashCustomers();
      }
    });
    pagination.appendChild(nextButton);
  }
}

function restoreManyCustomers() {
  const selectAllCheckbox = document.getElementById("select-all");
  if (selectAllCheckbox.checked) {
    fetch(`../php/api_patch.php?action=activateAllCustomers`)
      .then((response) => response.json())
      .then((data) => {
        const confirmModal = bootstrap.Modal.getInstance(
          document.getElementById("restoreManyCustomers")
        );
        confirmModal.hide();

        if (data.success) {
          window.onload();
        } else {
          alert(data.error + ` ${data.details}`);
          return;
        }
      });

    return;
  }

  const rowCheckboxes = document.querySelectorAll(".row-checkbox");
  const activateCustomerIds = [];
  rowCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const row = checkbox.closest("tr");
      const id = row.cells[1].textContent.trim();
      const index = trashCustomers.findIndex((customer) => customer.id === id);
      if (index != -1) {
        activateCustomerIds.push(id);
      }
    }
  });

  const idsString = activateCustomerIds.join(",");

  fetch(`../php/api_patch.php?action=activateCustomers&ids=${idsString}`)
    .then((response) => response.json())
    .then((data) => {
      const confirmModal = bootstrap.Modal.getInstance(
        document.getElementById("restoreManyCustomers")
      );
      confirmModal.hide();

      if (data.success) {
        window.onload();
      } else {
        alert(`${data.error} ${data.details}`);
      }
    });
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
    fetch(`../php/api_patch.php?action=activateCustomer&id=${operationId}`)
      .then((response) => response.json())
      .then((data) => {
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("restoreCustomersModal")
        );
        modal.hide();
        if (data.success) {
          window.onload();
        } else {
          alert(`${data.error} ${data.details}`);
        }
      });
  } else {
    alert(`Không tìm thấy id: ${operationId}`);
  }
}

function indexPage() {
  window.location.href = "../php/customerManagement.php";
}

window.onload = function () {
  loadTrashCustomers();
};
