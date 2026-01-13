const user = JSON.parse(localStorage.getItem("loggedInUser"));

if (!user || user.role !== "ROLE_ADMIN") {
    window.location.href = "/login.html";
}
