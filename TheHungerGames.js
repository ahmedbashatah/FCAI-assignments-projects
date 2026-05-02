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


// Signup form handling - Store users/admins in localStorage
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
        const isAdminCheckbox = signupForm.querySelector("input[type='checkbox']");
        const isAdmin = isAdminCheckbox ? isAdminCheckbox.checked : false;

        // Validation: Check if email is valid
        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }

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

        // Create new user/admin object
        const newUser = { 
            username: username, 
            password: password, 
            email: email, 
            isAdmin: isAdmin,
            createdAt: new Date().toISOString()
        };

        // Store user/admin in localStorage
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created successfully! Please login.");
        signupForm.reset();
        document.getElementById("formToggle").checked = false;
    });
}

// Login form handling - Check credentials against localStorage and store in sessionStorage
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
            alert("Username not found!");
            return;
        }

        // Validation: Check if credentials match in localStorage
        const found = users.find(u => u.username === username && u.password === password);
        if (!found) {
            alert("Incorrect password! Please try again.");
            return;
        }

        // Store login information temporarily in sessionStorage
        sessionStorage.setItem("currentUser", JSON.stringify(found));

        alert("Login successful!");
        
        // Redirect based on user type
        if (found.isAdmin) {
            window.location.href = "../admin/admin_home.html";
        } else {
            window.location.href = "../user/home.html";
        }
    });
}

// Guest login: limited temporary session (no reviews, no dashboard)
const guestBtn = document.getElementById('guestBtn');
if (guestBtn) {
    guestBtn.addEventListener('click', function () {
        const guest = { username: 'guest', isGuest: true, createdAt: new Date().toISOString() };
        try { sessionStorage.setItem('currentUser', JSON.stringify(guest)); } catch (e) { console.error(e); }
        // Send guest to guest-specific browsing page (simplified nav)
        window.location.href = "../user/guest.html";
    });
}