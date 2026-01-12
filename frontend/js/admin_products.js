const API_URL = "http://localhost:8080/api/admin/products";

let productList = [];

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});

// ================= LOAD PRODUCTS =================
function loadProducts() {
    fetch(API_URL)
        .then(res => res.json())
        .then(products => {
            productList = products;

            const tbody = document.getElementById("productTableBody");
            tbody.innerHTML = "";

            products.forEach(p => {
                 tbody.innerHTML += `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>₹${p.price}</td>
                    <td>${p.category}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})">
                            <i class="fa fa-edit"></i>
                        </button>

                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">
                            <i class="fa fa-trash"></i>
                        </button>

                        <button class="btn btn-sm btn-secondary" onclick="viewProduct(${p.id})">
                            <i class="fa fa-eye"></i>
                        </button>
                    </td>
                </tr>
                `;
            });
        })
        .catch(err => console.error("Load error:", err));
}




// ================= ADD / UPDATE =================
function saveProduct() {
    const id = document.getElementById("productId").value;

    const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        category: document.getElementById("category").value,
        imageUrl: document.getElementById("imageUrl").value,
        stock: document.getElementById("stock").value,
        description: document.getElementById("description").value
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    })
    .then(() => {
        resetForm();
        loadProducts();
        bootstrap.Modal.getInstance(
            document.getElementById("productModal")
        ).hide();
    })
    .catch(err => console.error("Save error:", err));
}

// ================= EDIT =================
function editProduct(id) {
    const product = productList.find(p => p.id === id);
    if (!product) return;

    document.getElementById("modalTitle").innerText = "Edit Product";

    document.getElementById("productId").value = product.id;
    document.getElementById("name").value = product.name;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value =
        product.category?.name || product.category;
    document.getElementById("imageUrl").value = product.imageUrl || "";
    document.getElementById("stock").value = product.stock || 0;
    document.getElementById("description").value = product.description || "";

    new bootstrap.Modal(
        document.getElementById("productModal")
    ).show();
}

// ================= DELETE =================
function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(() => loadProducts())
        .catch(err => console.error("Delete error:", err));
}

// ================= RESET =================
function resetForm() {
    document.getElementById("modalTitle").innerText = "Add Product";
    document.getElementById("productId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    document.getElementById("imageUrl").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("description").value = "";
}
