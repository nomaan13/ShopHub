 let admin = null;

try {
    admin = JSON.parse(localStorage.getItem("loggedInUser"));
} catch (e) {
    console.error("Invalid admin data");
}

// 🔒 ADMIN GUARD
if (!admin || admin.role !== "ROLE_ADMIN") {
    window.location.href = "../auth/login.html";
}

const API_URL = "http://localhost:8080/api/admin/products";

function loadAdminProducts() {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error("Unauthorized");
            return res.json();
        })
        .then(products => {
            const table = document.getElementById("adminProductTable");
            if (!table) return;

            table.innerHTML = "";

            products.forEach(p => {
                table.innerHTML += `
                <tr>
                    <td>${p.name}</td>
                    <td>${p.category?.name || "-"}</td>
                    <td>₹${p.price}</td>
                    <td>${p.stock}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editProduct(${p.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Delete</button>
                    </td>
                </tr>`;
            });
        })
        .catch(err => console.error("Admin product error:", err));
}

function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(() => loadAdminProducts());
}

loadAdminProducts();
