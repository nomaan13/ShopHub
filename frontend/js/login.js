let role = 'user';
let loginType = 'user';

function setType(type) {
  role = type;
  loginType = type;

  document.getElementById('userBtn').classList.remove('active');
  document.getElementById('adminBtn').classList.remove('active');
  document.getElementById(type + 'Btn').classList.add('active');
}

function login() {
  const emailInput = document.getElementById('email').value;
  const passwordInput = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');

  loginBtn.disabled = true;
  loginBtn.innerHTML = `
    <span class="spinner-border spinner-border-sm me-2"></span>
    Logging in...
  `;

  fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: emailInput, password: passwordInput, role })
  })
  .then(res => res.json())
  .then(d => {
    if (d.success) {
      const user = {
        email: emailInput,
        role: loginType === 'admin' ? "ROLE_ADMIN" : "ROLE_USER"
      };

      // ✅ Save user only here
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      setTimeout(() => {
        window.location.href =
          user.role === "ROLE_ADMIN"
            ? "/pages/admin/admin_dashboard.html"
            : "/index.html";
      }, 2000);
    } else {
      resetButton(loginBtn);
      showError(d.message);
    }
  })
  .catch(() => {
    resetButton(loginBtn);
    showError("Server error. Try again.");
  });
}

function resetButton(btn) {
  btn.disabled = false;
  btn.innerHTML = "Login";
}

function showError(msg) {
  const errBox = document.getElementById("loginError");
  errBox.innerText = msg;
  errBox.style.display = "block";
}
