// Get users from localStorage - refresh on each operation to get latest data
function getUsersFromStorage() {
    const usersStr = localStorage.getItem("users");
    if (!usersStr) {
        return [];
    }
    try {
        return JSON.parse(usersStr);
    } catch (e) {
        console.error("Error parsing users from localStorage:", e);
        return [];
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateUsername(username) {
    // Alphanumeric, 3-20 characters
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return usernameRegex.test(username);
}

// Admin Signup form handling - Store admin in localStorage
const signupForm = document.querySelector("#signup form");
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get fresh data from localStorage
        let users = getUsersFromStorage();

        const username = signupForm.querySelector("input[type='text']").value.trim();
        const password = signupForm.querySelectorAll("input[type='password']")[0].value;
        const confirmPass = signupForm.querySelectorAll("input[type='password']")[1].value;
        const email = signupForm.querySelector("input[type='email']").value.trim();


        // Validation: Check if email is valid
        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Validation: Check if username format
        if (!validateUsername(username)) {
            alert("Username must be 3-20 alphanumeric characters");
            return;
        }
        
        // Validation: Check if fields are empty
        if (!username || !password || !email) {
            alert("All fields are required!");
            return;
        }

        // Validation: Check if passwords match
        if (password !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }

        // Validation: Check if username already exists in localStorage
        if (users.some(u => u.username === username)) {
            alert("Username already taken!");
            return;
        }

        // Validation: Check if email already exists in localStorage
        if (users.some(u => u.email === email)) {
            alert("Email already registered!");
            return;
        }

        // Create new admin object (isAdmin is always true for admin signup)
        const newAdmin = { 
            username: username, 
            password: password, 
            email: email, 
            isAdmin: true,
            createdAt: new Date().toISOString()
        };

        // Store admin in localStorage
        users.push(newAdmin);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Admin account created successfully! Please login.");
        signupForm.reset();
        document.getElementById("formToggle").checked = false;
    });
}

// Admin Login form handling - Check credentials against localStorage and store in sessionStorage
const loginForm = document.querySelector("#login form");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get fresh data from localStorage
        let users = getUsersFromStorage();

        const username = loginForm.querySelector("input[name='username']").value.trim();
        const password = loginForm.querySelector("input[type='password']").value;

        // Validation: Check if fields are empty
        if (!username || !password) {
            alert("Please enter both username and password!");
            return;
        }

        // Validation: Check if users exist in localStorage
        const storedUsers = localStorage.getItem("users");
        if (!storedUsers || users.length === 0) {
            alert("No users found in the system. Please sign up first!");
            return;
        }

        // Validation: Check if username exists in localStorage
        const userExists = users.some(u => u.username === username);
        if (!userExists) {
            alert("Username not found. Please check your username or sign up!");
            return;
        }

        // Validation: Check if credentials match in localStorage
        const found = users.find(u => u.username === username && u.password === password);
        if (!found) {
            alert("Incorrect password! Please try again.");
            return;
        }

        // Validation: Check if the account is an admin account
        if (!found.isAdmin) {
            alert("This account is not an admin account. Please use the user login page.");
            return;
        }

        // Store login information temporarily in sessionStorage
        sessionStorage.setItem("currentUser", JSON.stringify(found));

        alert("Admin login successful! Redirecting...");
        
        // Redirect to admin home page
        window.location.href = "../admin/admin_home.html";
    });
}
