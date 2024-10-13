const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Set initial state
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light');
    themeToggle.checked = false;
} else {
    body.classList.add('dark');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        body.classList.remove('light');
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        localStorage.setItem('theme', 'light');
    }
});

function tabSwitch(tab) { 
    let containers = ['settings', 'home', 'games', 'chat', 'posts', 'about'];
    containers.forEach(container => {
        let element = document.getElementById(container);
        if (element) {
            element.style.display = 'none';
        }
    });
    let selectedTab = document.getElementById(tab);
    if (selectedTab) {
        if (tab === 'chat') { 
            selectedTab.style.display = 'flex';
            loadUsers();
        } else if (tab === 'games') {
            selectedTab.style.display = 'flex';
        } else {
            selectedTab.style.display = 'block';
        }
    }

    // Update active state in sidebar
    let sidebarItems = document.querySelectorAll('.sidebar .icons li');
    sidebarItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(tab)) {
            item.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    tabSwitch('home');
});

// Sidebar Position
const sidebarPositionToggle = document.getElementById('sidebar-position-toggle');
const mainElement = document.querySelector('main');

// Set initial state
if (localStorage.getItem('sidebarPosition') === 'right') {
    mainElement.classList.add('sidebar-right');
    sidebarPositionToggle.checked = true;
}

// Add event listener for sidebar position toggle
function toggleSidebarPosition() {
    if (sidebarPositionToggle.checked) {
        mainElement.classList.add('sidebar-right');
        localStorage.setItem('sidebarPosition', 'right');
    } else {
        mainElement.classList.remove('sidebar-right');
        localStorage.setItem('sidebarPosition', 'left');
    }
}

sidebarPositionToggle.addEventListener('change', toggleSidebarPosition);

function login() {
    let username = document.querySelector('.login input[type="text"]').value;
    let password = document.querySelector('.login input[type="password"]').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', username); // Store the username
            currentUser = username; // Set currentUser
            document.querySelector('.login').style.display = 'none';
            console.log('Login successful');
            sessionStorage.setItem('currentUser', username);
        } else {
            console.log('Login failed:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function logout(accountDeleted = false) {
    sessionStorage.removeItem('loggedIn');
    localStorage.removeItem('theme');
    localStorage.removeItem('sidebarPosition');
    document.querySelector('.login').style.display = 'flex';
    document.querySelector('.signup').style.display = 'none';
    body.classList.remove('light', 'dark');
    body.classList.add('dark');
    themeToggle.checked = true;
    sidebarPositionToggle.checked = false;
    mainElement.classList.remove('sidebar-right');
    console.log(accountDeleted ? 'Account deleted and logged out' : 'Logged out');
    tabSwitch('home');

    if (accountDeleted) {
        alert('Your account has been successfully deleted.');
    }
}

function showSignup() {
    document.querySelector('.login').style.display = 'none';
    document.querySelector('.signup').style.display = 'flex';
}

function showLogin() {
    document.querySelector('.signup').style.display = 'none';
    document.querySelector('.login').style.display = 'flex';
}

function signup() {
    let username = document.getElementById('signup-username').value;
    let password = document.getElementById('signup-password').value;
    let confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        console.log('Passwords do not match');
        return;
    }

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', username); // Store the username
            currentUser = username; // Set currentUser
            document.querySelector('.signup').style.display = 'none';
            console.log('Signup successful');
        } else {
            console.log('Signup failed:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function changePassword() {
    const currentPassword = document.getElementById('change-password-current').value;
    const newPassword = document.getElementById('change-password-new').value;
    const confirmNewPassword = document.getElementById('change-password-confirm').value;

    if (newPassword !== confirmNewPassword) {
        console.log('New passwords do not match');
        return;
    }

    fetch('/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            currentPassword,
            newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Password changed successfully');
            // Clear the input fields
            document.getElementById('change-password-current').value = '';
            document.getElementById('change-password-new').value = '';
            document.getElementById('change-password-confirm').value = '';
        } else {
            console.log('Failed to change password:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function confirmDeleteAccount() {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        deleteAccount();
    }
}

function deleteAccount() {
    fetch('/delete-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Account deleted successfully');
            logout(); // Call the logout function to clear session and return to login screen
        } else {
            console.log('Failed to delete account:', data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
