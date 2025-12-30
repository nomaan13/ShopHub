function loadComponent(id, path) {
    fetch(path)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error("Error loading component:", error));
}

// Detect if current page is inside /pages/
const isSubPage = window.location.pathname.includes("/pages/");
const basePath = isSubPage ? "../../" : "";

// Load navbar and footer
loadComponent("navbar", basePath + "components/navbar.html");
loadComponent("footer", basePath + "components/footer.html");
