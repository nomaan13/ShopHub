const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const productContainer = document.getElementById("product_list");


console.log("product_list.js loaded");
console.log(document.getElementById("product_list"));


let currentPage = 0;
const pageSize = 8;

function loadProducts(page = 0) {
  let apiUrl = `http://localhost:8080/api/products?page=${page}&size=${pageSize}`;

  if (category) {
    document.getElementById("page-title").innerText =
      category + " Products";
    apiUrl =
      `http://localhost:8080/api/products/category/${category}?page=${page}&size=${pageSize}`;
  }

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      renderProducts(data.content);
      renderPagination(data.totalPages, data.number);
    })
    .catch(err => console.error(err));
}

function renderProducts(products) {
  
  const container = document.getElementById("product_list");

  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found</p>";
    return;
  }

  products.forEach(p => {
    container.innerHTML += `
      <div class="col-md-3 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h6>${p.name}</h6>
            <p class="text-muted">${p.category?.name ?? ""}</p>
            <p class="fw-bold">₹${p.price}</p>

            <a href="product_details.html?id=${p.id}"
               class="btn btn-primary btn-sm">
               View Details
            </a>
          </div>
        </div>
      </div>
    `;
  });
}

function renderPagination(totalPages, current) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 0; i < totalPages; i++) {
    pagination.innerHTML += `
      <button class="btn btn-sm mx-1 ${i === current ? 'btn-primary' : 'btn-outline-primary'}"
        onclick="loadProducts(${i})">
        ${i + 1}
      </button>
    `;
  }
}

// INITIAL LOAD
loadProducts();
