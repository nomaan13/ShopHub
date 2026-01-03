function loadComponent(id, path) {
    fetch(path)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load ' + path);
            return response.text();
        })
        .then(data => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = data;
        })
        .catch(error => console.error("Error loading component:", error));
}

// Use root-relative paths for components so they work from any page depth.
// This requires the static server to expose /components/*.html at the site root.
loadComponent("navbar", "/components/navbar.html");
loadComponent("footer", "/components/footer.html");