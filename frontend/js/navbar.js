document.addEventListener("DOMContentLoaded", () => {
    // Get DOM elements
    const loginNav = document.getElementById("loginNav");
    const logoutNav = document.getElementById("logoutNav");
    const userAvatarLogged = document.getElementById("userAvatarLogged");
    const logoutBtn = document.getElementById("logoutBtn");

    console.log("Navbar.js loaded - checking user status");

    // Function to update navbar based on login status
    function updateNavbar() {
        console.log("updateNavbar() called");
        
        // Check for different possible user storage keys
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const userLoggedIn = JSON.parse(localStorage.getItem("userLoggedIn"));
        const adminLoggedIn = JSON.parse(localStorage.getItem("adminLoggedIn"));
        
        console.log("Storage check:", {
            loggedInUser,
            isLoggedIn,
            userLoggedIn,
            adminLoggedIn
        });
        
        // Determine if user is logged in and get their info
        let user = null;
        let userName = "";
        
        if (loggedInUser && loggedInUser.name) {
            user = loggedInUser;
            userName = loggedInUser.name;
            console.log("Found user in loggedInUser:", userName);
        } else if (userLoggedIn && userLoggedIn.name) {
            user = userLoggedIn;
            userName = userLoggedIn.name;
            console.log("Found user in userLoggedIn:", userName);
        } else if (adminLoggedIn && adminLoggedIn.name) {
            user = adminLoggedIn;
            userName = adminLoggedIn.name;
            console.log("Found user in adminLoggedIn:", userName);
        } else if (isLoggedIn === "true") {
            // If only a flag exists, try to get name from other possible keys
            userName = "User";
            console.log("Only isLoggedIn flag found");
        }
        
        // If user is logged in
        if (userName || isLoggedIn === "true") {
            console.log("User is logged in, showing avatar with letter:", userName);
            
            // Show first letter of username
            if (userName && userName.trim().length > 0) {
                const firstLetter = userName.charAt(0).toUpperCase();
                console.log("Setting avatar letter to:", firstLetter);
                userAvatarLogged.textContent = firstLetter;
                
                // Optional: Set different background colors for different users
                if (adminLoggedIn || (user && user.role === "ROLE_ADMIN")) {
                    userAvatarLogged.style.backgroundColor = "#dc3545"; // Red for admin
                } else {
                    userAvatarLogged.style.backgroundColor = "#28a745"; // Green for regular users
                }
            } else {
                console.log("No username found, defaulting to 'U'");
                userAvatarLogged.textContent = "U";
            }
            
            // Toggle menu options
            loginNav.classList.add("d-none");
            logoutNav.classList.remove("d-none");
        } else {
            // User is not logged in
            console.log("User is NOT logged in, showing login icon");
            loginNav.classList.remove("d-none");
            logoutNav.classList.add("d-none");
        }
    }

    // Initialize navbar on page load
    updateNavbar();

    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log("Logout clicked");
            
            // Clear all user-related data from localStorage
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userLoggedIn");
            localStorage.removeItem("adminLoggedIn");
            
            // Optional: Clear cart if you want
            // localStorage.removeItem("cart");
            
            // Redirect to login page
            window.location.href = "/pages/auth/login.html";
        });
    }

    // Export the updateNavbar function so login.js can call it
    window.updateNavbar = updateNavbar;

    // Optional: Listen for storage changes to update navbar across tabs
    window.addEventListener('storage', function(e) {
        console.log("Storage changed:", e.key);
        if (e.key === 'loggedInUser' || e.key === 'isLoggedIn' || 
            e.key === 'userLoggedIn' || e.key === 'adminLoggedIn') {
            updateNavbar();
        }
    });
});
