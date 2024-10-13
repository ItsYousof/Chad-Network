function checkLoginStatus() {
    let loginBox = document.querySelector('.login');
    if (sessionStorage.getItem('loggedIn') == null) {
        loginBox.style.display = 'flex';
        console.log('User is not logged in, showing login');
    } else {
        loginBox.style.display = 'none';
        console.log('User is logged in, hiding login');
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);
