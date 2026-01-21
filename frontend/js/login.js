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
      // Extract user name from response or use email as fallback
      // Assuming your API returns user data with 'name' field
      const userName = d.user?.name || emailInput.split('@')[0]; // Use first part of email if no name
      
      const user = {
        name: userName,  // This is the key for showing first letter
        email: emailInput,
        role: loginType === 'admin' ? "ROLE_ADMIN" : "ROLE_USER",
        // Add other user data from API response if available
        ...d.user // Spread any additional user data from API
      };

      console.log("Login successful, user data:", user);

      // Store user data for navbar to display first letter
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      
      // Store based on role for better organization
      if (loginType === 'admin') {
        localStorage.setItem("adminLoggedIn", JSON.stringify(user));
      } else {
        localStorage.setItem("userLoggedIn", JSON.stringify(user));
      }

      // Force update navbar immediately
      if (typeof updateNavbar === 'function') {
        console.log("Calling updateNavbar from login.js");
        updateNavbar();
      }

      // Show success message
      loginBtn.innerHTML = `
        <i class="fas fa-check me-2"></i>
        Login Successful! Redirecting...
      `;
      loginBtn.classList.remove('btn-primary');
      loginBtn.classList.add('btn-success');

      // Redirect after a short delay to allow navbar update
      setTimeout(() => {
        window.location.href =
          user.role === "ROLE_ADMIN"
            ? "/pages/admin/admin_dashboard.html"
            : "/index.html";
      }, 1500);
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
  btn.classList.remove('btn-success');
  btn.classList.add('btn-primary');
}

function showError(msg) {
  const errBox = document.getElementById("loginError");
  errBox.innerText = msg;
  errBox.style.display = "block";
}

// Optional: If your API doesn't return user name, use this fallback
function extractNameFromEmail(email) {
  const emailPart = email.split('@')[0];
  // Capitalize first letter and replace dots with spaces
  return emailPart
    .split('.')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}