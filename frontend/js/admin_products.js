const rowsPerPage = 10;
let currentPage = 1;
let products = [];
let totalItems = 0;
let totalPages = 0;
let isSearchMode = false; // ✅ track whether we are in search mode

// ✅ Load products from API (backend pagination)
async function loadProducts() {
  const res = await fetch(`http://localhost:8080/api/products?page=${currentPage - 1}&size=${rowsPerPage}`);
  const data = await res.json();

  products = data.content;          // backend already paginates
  totalItems = data.totalElements;  // total count from backend
  totalPages = data.totalPages;     // total pages from backend

  renderTable();
}

// ✅ Load categories for dropdown
async function loadCategories() {
  const res = await fetch("http://localhost:8080/api/categories");
  const categories = await res.json();

  const select = document.getElementById("category");
  select.innerHTML = categories.map(c =>
    `<option value="${c.id}">${c.name}</option>`
  ).join("");
}

// ✅ Render product table
function renderTable() {
  const tbody = document.getElementById("productTableBody");
  tbody.innerHTML = "";

  products.forEach(p => {
    tbody.innerHTML += `
      <tr>
        <td>${p.id}</td>
        <td>
          <img src="${p.imageUrl || 'https://via.placeholder.com/40'}" 
               alt="${p.name}" 
               class="img-thumbnail me-2" 
               style="width:40px; height:40px; object-fit:cover;">
          ${p.name}
        </td>
        <td>₹${p.price.toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>${p.category.name}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})"><i class="fa fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `;
  });

  renderPagination();
}

// ✅ Pagination
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <button class="page-link" onclick="goToPage(${i})">${i}</button>
      </li>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  if (isSearchMode) {
    // ✅ paginate search results manually
    renderTable();
  } else {
    loadProducts(); // ✅ fetch correct page from backend
  }
}

// ✅ Save product (Add or Update)
async function saveProduct() {
  const id = document.getElementById("productId").value;
  const productName = document.getElementById("name").value;

  const product = {
    name: productName,
    description: document.getElementById("description").value,
    price: parseFloat(document.getElementById("price").value),
    stock: parseInt(document.getElementById("stock").value),
    imageUrl: document.getElementById("imageUrl").value,
    category: { id: parseInt(document.getElementById("category").value) }
  };

  let response;
  if (id) {
    response = await fetch(`http://localhost:8080/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
  } else {
    response = await fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
  }

  if (response.ok) {
    document.getElementById("toastMessage").textContent = `${productName} added successfully ✅`;
    new bootstrap.Toast(document.getElementById("successToast")).show();
  } else {
    document.getElementById("toastMessage").textContent = "Error saving product ❌";
    new bootstrap.Toast(document.getElementById("successToast")).show();
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
  modal.hide();

  currentPage = 1; // reset to first page
  isSearchMode = false; // ✅ reset search mode
  loadProducts();  // ✅ reload list
}

// ✅ Edit product (prefill modal)
async function editProduct(id) {
  const res = await fetch(`http://localhost:8080/api/products/${id}`);
  const p = await res.json();

  document.getElementById("productId").value = p.id;
  document.getElementById("name").value = p.name;
  document.getElementById("description").value = p.description;
  document.getElementById("price").value = p.price;
  document.getElementById("stock").value = p.stock;
  document.getElementById("imageUrl").value = p.imageUrl;

  await loadCategories(); // ✅ preload dropdown
  document.getElementById("category").value = p.category.id;

  document.getElementById("modalTitle").textContent = "Edit Product";

  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

// ✅ Delete product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" });
    isSearchMode = false; // ✅ reset search mode
    loadProducts();
  }
}

// ✅ Search products (backend-powered)
async function searchProducts(keyword) {
  const res = await fetch(`http://localhost:8080/api/products/search?keyword=${keyword}`);
  const data = await res.json();

  products = data; // backend returns full list of matches
  totalItems = data.length;
  totalPages = Math.ceil(totalItems / rowsPerPage);
  currentPage = 1;
  isSearchMode = true;

  renderTable();
}

// ✅ Event listeners
document.getElementById("searchInput").addEventListener("input", async (e) => {
  const keyword = e.target.value.trim();
  if (keyword) {
    await searchProducts(keyword);
  } else {
    isSearchMode = false;
    currentPage = 1;
    loadProducts(); // reload normal paginated list
  }
});

// ✅ Initial load
loadProducts();
loadCategories();
