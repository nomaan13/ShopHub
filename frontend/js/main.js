// ================= LOAD COMPONENT =================
function loadComponent(id, path, callback) {
    fetch(path)
        .then(res => {
            if (!res.ok) throw new Error("Failed to load " + path);
            return res.text();
        })
        .then(html => {
            const el = document.getElementById(id);
            if (el) {
                el.innerHTML = html;
                if (callback) callback(); // VERY IMPORTANT
            }
        })
        .catch(err => console.error(err));
}

// ================= LOAD NAVBAR & FOOTER =================
loadComponent("navbar", "/components/navbar.html", initNavbar);
loadComponent("footer", "/components/footer.html");

// ================= USER SAFE READ =================
function getLoggedInUser() {
    try {
        const user = localStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    } catch {
        localStorage.removeItem("loggedInUser");
        return null;
    }
}


// ================= NAVBAR INIT =================
function initNavbar() {

    const user = getLoggedInUser();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const loginNav = document.getElementById("loginNav");
    const logoutNav = document.getElementById("logoutNav");
    const adminLink = document.getElementById("adminProductsLink");
    const cartCountEl = document.getElementById("cartCount");
    const logoutBtn = document.getElementById("logoutBtn");

    // ---- LOGIN / LOGOUT ----
    if (loginNav && logoutNav) {
        if (isLoggedIn) {
            loginNav.classList.add("d-none");
            logoutNav.classList.remove("d-none");
        } else {
            loginNav.classList.remove("d-none");
            logoutNav.classList.add("d-none");
        }
    }

    // ---- ADMIN VISIBILITY ----
    if (adminLink) {
        if (user && (user.role === "ADMIN" || user.role === "ROLE_ADMIN")) {
            adminLink.classList.remove("d-none");
        } else {
            adminLink.classList.add("d-none");
        }
    }

    // ---- CART COUNT ----
    if (cartCountEl) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartCountEl.innerText = cart.length;
    }

    // ---- LOGOUT ----
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.clear();
            window.location.href = "/pages/auth/login.html";
        });
    }
}
