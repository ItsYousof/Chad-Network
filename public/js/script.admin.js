document.addEventListener('DOMContentLoaded', () => {
    checkAdminStatus();
});

function checkAdminStatus() {
    fetch('/admin/check-status')
        .then(response => response.json())
        .then(data => {
            if (!data.isAdmin) {
                showLoginPopup();
            } else {
                initializeAdminPanel();
            }
        });
}

function showLoginPopup() {
    const loginPopup = document.getElementById('login-popup');
    loginPopup.style.display = 'block';

    const loginForm = document.getElementById('admin-login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        loginAdmin(username, password);
    });
}

function loginAdmin(username, password) {
    fetch('/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('login-popup').style.display = 'none';
            initializeAdminPanel();
        } else {
            document.getElementById('login-message').textContent = 'Invalid credentials';
        }
    });
}

function initializeAdminPanel() {
    // Your existing admin panel initialization code
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tab).classList.add('active');
            loadTabContent(tab);
        });
    });

    loadTabContent('users');
}

function loadTabContent(tab) {
    switch(tab) {
        case 'users':
            fetchUsers();
            break;
        case 'tweets':
            fetchTweets();
            break;
        case 'comments':
            fetchComments();
            break;
    }
}

function fetchUsers() {
    fetch('/admin/users')
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = `
                <table>
                    <tr>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                    ${data.users.map(user => `
                        <tr>
                            <td>${user.username}</td>
                            <td>
                                <button onclick="editUser('${user.username}')">Edit Username</button>
                                <button onclick="resetPassword('${user.username}')">Reset Password</button>
                                <button class="delete" onclick="deleteUser('${user.username}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            `;
        });
}

function fetchTweets() {
    fetch('/admin/tweets')
        .then(response => response.json())
        .then(data => {
            const tweetsList = document.getElementById('tweets-list');
            tweetsList.innerHTML = `
                <table>
                    <tr>
                        <th>User</th>
                        <th>Content</th>
                        <th>Actions</th>
                    </tr>
                    ${data.tweets.map(tweet => `
                        <tr>
                            <td>${tweet.sender}</td>
                            <td>${tweet.message}</td>
                            <td>
                                <button onclick="editTweet('${tweet.id}')">Edit</button>
                                <button class="delete" onclick="deleteTweet('${tweet.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            `;
        });
}

function fetchComments() {
    fetch('/admin/comments')
        .then(response => response.json())
        .then(data => {
            const commentsList = document.getElementById('comments-list');
            commentsList.innerHTML = `
                <table>
                    <tr>
                        <th>User</th>
                        <th>Content</th>
                        <th>Tweet ID</th>
                        <th>Actions</th>
                    </tr>
                    ${data.comments.map(comment => `
                        <tr>
                            <td>${comment.sender}</td>
                            <td>${comment.message}</td>
                            <td>${comment.tweetId}</td>
                            <td>
                                <button onclick="editComment('${comment.id}')">Edit</button>
                                <button class="delete" onclick="deleteComment('${comment.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </table>
            `;
        });
}

function showPopup(title, message, inputPlaceholder, confirmCallback) {
    const popup = document.getElementById('popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupInput = document.getElementById('popup-input');
    const popupCancel = document.getElementById('popup-cancel');
    const popupConfirm = document.getElementById('popup-confirm');

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    if (inputPlaceholder) {
        popupInput.style.display = 'block';
        popupInput.placeholder = inputPlaceholder;
        popupInput.value = '';
    } else {
        popupInput.style.display = 'none';
    }

    popup.style.display = 'block';

    popupCancel.onclick = () => {
        popup.style.display = 'none';
    };

    popupConfirm.onclick = () => {
        popup.style.display = 'none';
        if (confirmCallback) {
            confirmCallback(popupInput.value);
        }
    };
}

function editUser(username) {
    showPopup('Edit User', `Enter new username for ${username}:`, 'New username', (newUsername) => {
        if (newUsername) {
            fetch(`/admin/users/${username}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newUsername })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showPopup('Success', 'User updated successfully');
                    fetchUsers();
                } else {
                    showPopup('Error', 'Failed to update user');
                }
            });
        }
    });
}

function deleteUser(username) {
    showPopup('Delete User', `Are you sure you want to delete user ${username}?`, null, () => {
        fetch(`/admin/users/${username}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showPopup('Success', 'User deleted successfully');
                fetchUsers();
            } else {
                showPopup('Error', 'Failed to delete user');
            }
        });
    });
}

function editTweet(id) {
    showPopup('Edit Tweet', 'Enter new tweet content:', 'New content', (newContent) => {
        if (newContent) {
            fetch(`/admin/tweets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newContent })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showPopup('Success', 'Tweet updated successfully');
                    fetchTweets();
                } else {
                    showPopup('Error', 'Failed to update tweet');
                }
            });
        }
    });
}

function deleteTweet(id) {
    showPopup('Delete Tweet', 'Are you sure you want to delete this tweet?', null, () => {
        fetch(`/admin/tweets/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showPopup('Success', 'Tweet deleted successfully');
                fetchTweets();
            } else {
                showPopup('Error', 'Failed to delete tweet');
            }
        });
    });
}

function editComment(id) {
    showPopup('Edit Comment', 'Enter new comment content:', 'New content', (newContent) => {
        if (newContent) {
            fetch(`/admin/comments/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newContent })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showPopup('Success', 'Comment updated successfully');
                    fetchComments();
                } else {
                    showPopup('Error', 'Failed to update comment');
                }
            });
        }
    });
}

function deleteComment(id) {
    showPopup('Delete Comment', 'Are you sure you want to delete this comment?', null, () => {
        fetch(`/admin/comments/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showPopup('Success', 'Comment deleted successfully');
                fetchComments();
            } else {
                showPopup('Error', 'Failed to delete comment');
            }
        });
    });
}

function togglePassword(icon) {
    const passwordField = icon.previousElementSibling;
    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        passwordField.type = "password";
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function resetPassword(username) {
    showPopup('Reset Password', `Enter new password for ${username}:`, 'New password', (newPassword) => {
        if (newPassword) {
            fetch(`/admin/users/${username}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showPopup('Success', 'Password reset successfully');
                } else {
                    showPopup('Error', 'Failed to reset password');
                }
            });
        }
    });
}
