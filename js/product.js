var products = [];

var operationId;

var currentImg = "";

var currentPage = 1;

var pageSize = 10;

var globalSearchName = "";

function loadProducts() {
  const productTableBody = document.getElementById("prducts-table-body");
  productTableBody.innerHTML = "";

  fetch(
    `../php/api_get.php?action=getHangHoa&page=${currentPage}&limit=${pageSize}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("loadProducts: ", data);

      products = data.products;

      products.forEach((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td class="text-center align-middle">${product.id}</td>
        <td class="text-center align-middle">${product.name}</td>
        <td class="text-center align-middle">${numFormater(
          Number(product.price)
        )}  VND</td>
        <td class="text-center align-middle"><img style="width: auto; height: 50px;" src=${
          product.img_url
        }></td>
        <td class="text-center align-middle">${product.stock}</td>
        <td class="text-center align-middle">${product.sold}</td>
        <td class="text-center align-middle">
          <button
            class="btn btn-sm btn-warning"
            data-product-id='${product.id}'
            data-bs-toggle="modal"
            data-bs-target="#editProductModal"
          >
            Sửa
          </button>
          <button
            class="btn btn-sm btn-danger"
            data-product-id='${product.id}'
            data-bs-toggle="modal"
            data-bs-target="#deleteProductModal"
          >
            Xóa
          </button>
        </td>
        `;

        productTableBody.appendChild(row);
      });

      createPagination(Number(data.total));
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
        findByName();
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
        findByName();
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
        findByName();
      }
    });
    pagination.appendChild(nextButton);
  }
}

function addProduct() {
  const productName = document.getElementById("productName").value;
  const price = document.getElementById("price").value;
  const imgProductFile = document.getElementById("imgProduct").files[0];

  if (!productName || !price || !imgProductFile) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  const newProdcut = new FormData();
  newProdcut.append("name", productName);
  newProdcut.append("price", price);
  newProdcut.append("img", imgProductFile);

  fetch(`../php/api_post.php?action=createProduct`, {
    method: "POST",
    body: newProdcut,
  })
    .then((response) => response.json())
    .then((data) => {

      document.getElementById("prodcutForm").reset();
      document.getElementById("previewImage").style.display = "none";
      if (data.success) {
        window.onload();
      } else {
        alert(`${data.error} ${data.details}`);
      }
    });
}

function numFormater(num) {
  return num.toLocaleString("vi-VN");
}

document
  .getElementById("imgProduct")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("previewImage");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.src = "";
      previewImage.style.display = "none";
    }
  });

function findByName() {
  const searchNameValue = document
    .getElementById("searchName")
    .value.toLowerCase();

  globalSearchName = searchNameValue;

  const productTableBody = document.getElementById("prducts-table-body");
  productTableBody.innerHTML = "";

  fetch(
    `../php/api_get.php?action=getHangHoaByName&name=${globalSearchName}&page=${currentPage}&limit=${pageSize}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("loadProducts: ", data);

      products = data.products;

      products.forEach((product) => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td class="text-center align-middle">${product.id}</td>
        <td class="text-center align-middle">${product.name}</td>
        <td class="text-center align-middle">${numFormater(
          Number(product.price)
        )}  VND</td>
        <td class="text-center align-middle"><img style="width: auto; height: 50px;" src=${
          product.img_url
        }></td>
        <td class="text-center align-middle">${product.stock}</td>
        <td class="text-center align-middle">${product.sold}</td>
        <td class="text-center align-middle">
          <button
            class="btn btn-sm btn-warning"
            data-product-id='${product.id}'
            data-bs-toggle="modal"
            data-bs-target="#editProductModal"
          >
            Sửa
          </button>
          <button
            class="btn btn-sm btn-danger"
            data-product-id='${product.id}'
            data-bs-toggle="modal"
            data-bs-target="#deleteProductModal"
          >
            Xóa
          </button>
        </td>
        `;

        productTableBody.appendChild(row);
      });

      createPagination(Number(data.total));
      document.getElementById(
        "result-count"
      ).innerText = `Tìm thấy ${data.total} kết quả.`;
    });
}

var editProductModal = document.getElementById("editProductModal");
editProductModal.addEventListener("show.bs.modal", function (e) {
  let button = e.relatedTarget;
  operationId = button.getAttribute("data-product-id");
  const idx = products.findIndex((x) => x.id === operationId);
  if (idx != -1) {
    document.getElementById("editProductName").value = products[idx].name;
    document.getElementById("editProductPrice").value = products[idx].price;
    document.getElementById("currentProductImage").src = products[idx].img_url;
    currentImg = products[idx].img_url;
    document.getElementById("editProductStock").value = products[idx].stock;
  }
});
document
  .getElementById("editProductImage")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const previewImage = document.getElementById("currentProductImage");

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.src = "";
      previewImage.style.display = "none";
    }
  });
function editProduct() {
  const updateProduct = new FormData();
  updateProduct.append("id", operationId);
  updateProduct.append(
    "name",
    document.getElementById("editProductName").value
  );
  updateProduct.append(
    "price",
    document.getElementById("editProductPrice").value
  );
  updateProduct.append(
    "stock",
    document.getElementById("editProductStock").value
  );

  const imgFile = document.getElementById("editProductImage").files[0];

  if (imgFile) {
    updateProduct.append("img", imgFile);
    updateProduct.append("current_img", currentImg);
  }

  fetch(`../php/api_post.php?action=updateProduct`, {
    method: "POST",
    body: updateProduct,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        window.onload();
      } else {
        alert(`${data.error} ${data.details}`);
      }
    });
}

var deleteProductModal = document.getElementById("deleteProductModal");
deleteProductModal.addEventListener("show.bs.modal", function (e) {
  let button = e.relatedTarget;
  operationId = button.getAttribute("data-product-id");
  const idx = products.findIndex((x) => x.id === operationId);
  if (idx != -1) {
    currentImg = products[idx].img_url;
  }
});
document
  .getElementById("confirmDeleteProductBtn")
  .addEventListener("click", function () {
    fetch(`../php/api_delete.php?action=deleteProduct&img=${currentImg}&id=${operationId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.onload();
        } else {
          alert(`${data.error} ${data.details}`);
        }
      });
  });

window.onload = function () {
  loadProducts();
};
