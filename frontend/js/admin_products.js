const API_URL = "http://localhost:8080/api/admin/products";

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

// ================= LOAD PRODUCTS =================
function loadProducts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(products => {
            const tbody = document.getElementById("productTableBody");
            tbody.innerHTML = "";

            products.forEach(p => {
                tbody.innerHTML += `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.name}</td>
                        <td>₹${p.price}</td>
                        <td>${p.category?.name || p.category}</td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick='editProduct(${JSON.stringify(p)})'>
                                Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error(err));
}

// ================= ADD / UPDATE =================
function saveProduct() {

    const id = document.getElementById("productId").value;

    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        category: document.getElementById("category").value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    })
    .then(() => {
        resetForm();
        loadProducts();
        bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    });
}

// ================= EDIT =================
function editProduct(product) {
    document.getElementById("modalTitle").innerText = "Edit Product";
    document.getElementById("productId").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category?.name || "";

    new bootstrap.Modal(document.getElementById("productModal")).show();
}

// ================= DELETE =================
function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => loadProducts());
}

// ================= RESET =================
function resetForm() {
    document.getElementById("modalTitle").innerText = "Add Product";
    document.getElementById("productId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
}
