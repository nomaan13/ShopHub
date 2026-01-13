document.addEventListener("DOMContentLoaded", () => {
  const loginNav = document.getElementById("loginNav");
  const logoutNav = document.getElementById("logoutNav");
  const logoutBtn = document.getElementById("logoutBtn");

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (user) {
    loginNav.classList.add("d-none");
    logoutNav.classList.remove("d-none");
  } else {
    loginNav.classList.remove("d-none");
    logoutNav.classList.add("d-none");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      window.location.href = "/pages/auth/login.html";
    });
  }
});
