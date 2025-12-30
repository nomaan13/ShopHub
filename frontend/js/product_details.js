// Read product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  document.getElementById("product-details").innerHTML =
    "<p class='text-danger'>Invalid product</p>";
  throw new Error("Product ID missing in URL");
}

// Fetch product from backend
fetch(`http://localhost:8080/api/products/${productId}`)
  .then(res => {
    if (!res.ok) {
      throw new Error("Product not found");
    }
    return res.json();
  })
  .then(product => renderProduct(product))
  .catch(err => {
    console.error(err);
    document.getElementById("product-details").innerHTML =
      "<p class='text-danger'>Unable to load product details</p>";
  });

// Render product HTML
document.getElementById("product-details").innerHTML = `
  <div class="col-md-5">
    <div class="product-image-box">
      <img 
        src="${p.imageUrl || '/e-commerce/assets/images/camera.jpg'}"
        alt="${p.name}"
        class="img-fluid"
      >
    </div>
  </div>

  <div class="col-md-7">
    <h3>${p.name}</h3>
    <p class="text-muted fw-bold">₹${p.price}</p>

    <p>${p.description || "No description available"}</p>

    <p class="text-secondary">
      Category: ${p.category?.name || "N/A"}
    </p>

    <div class="d-flex gap-3">
      <button class="btn btn-primary">Add to Cart</button>
      <button class="btn btn-outline-secondary">Add to Wishlist</button>
    </div>
  </div>
`;
