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
          <button class="btn btn-success btn-sm mt-2"
                  onclick="addToCart(${p.id}, '${p.name}', ${p.price}, '${p.imageUrl || ''}')">
            Add to Cart
          </button>
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


// async function loadUserProducts() {
//   const res = await fetch("http://localhost:8080/api/products/all");
//   const products = await res.json();

//   const container = document.getElementById("productList");
//   container.innerHTML = "";

//   products.forEach(p => {
//     container.innerHTML += `
//       <div class="card">
//         <img src="${p.imageUrl || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${p.name}">
//         <div class="card-body">
//           <h5 class="card-title">${p.name}</h5>
//           <p class="card-text">₹${p.price.toFixed(2)}</p>
//           <p class="card-text">${p.description}</p>
//         </div>
//       </div>
//     `;
//   });
// }

async function loadUserProducts() {
  try {
    const res = await fetch("http://localhost:8080/api/products/all");
    if (!res.ok) {
      throw new Error("Failed to fetch products: " + res.status);
    }
    const products = await res.json();

    if (!Array.isArray(products)) {
      throw new Error("Response is not an array");
    }

    renderProducts(products);
  } catch (err) {
    console.error(err);
    productContainer.innerHTML = "<p class='text-danger'>Failed to load products</p>";
  }
}

//addtot cart function
function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already exists in cart
  const existingIndex = cart.findIndex(item => item.id === id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      image,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}



// INITIAL LOAD
loadProducts();
