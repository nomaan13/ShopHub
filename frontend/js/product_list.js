// 1. Read category from URL
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");  
const categoryName = params.get("name");

// 2. API URL
let apiUrl = "http://localhost:8080/api/products";

// 3. If category present → filter
if (categoryId) {
    document.getElementById("page-title").innerText =
        categoryName + " Products";
    apiUrl = `http://localhost:8080/api/products/category/${categoryId}`;
}

// 4. Fetch products
fetch(apiUrl)
  .then(res => res.json())
  .then(data => renderProducts(data))
  .catch(err => console.error(err));

// 5. Render products
function renderProducts(products) {
  const container = document.getElementById("product_list");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
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

            <a href="product_details.html?id=${p.id}" class="btn btn-primary btn-sm">View Details</a>
            <button class="btn btn-outline-secondary btn-sm">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}
