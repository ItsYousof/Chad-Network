function loadAccounts() {
    // Fetch the JSON file
    fetch('Javascript/users.json')
        .then(response => response.json())
        .then(accounts => {
            const accountsContainer = document.querySelector('.accounts');

            // Clear previous content
            accountsContainer.innerHTML = '';

            // Loop through each account in the JSON data
            accounts.forEach(account => {
                // Create elements for each account
                const accountDiv = document.createElement('div');
                accountDiv.classList.add('account');

                const usernameHeading = document.createElement('h3');
                usernameHeading.textContent = account.username;

                const nameparagraph = document.createElement('p');
                nameparagraph.textContent = "Name: " + account.username;

                const passwordParagraph = document.createElement('p');
                passwordParagraph.textContent = "Password: " + account.password;

                const roleHeading = document.createElement('h5');
                roleHeading.textContent = "Role: " + account.role;

                const verifyButton = document.createElement('button');
                verifyButton.textContent = account.verified ? "Verified" : "Not Verified";
                verifyButton.style.backgroundColor = account.verified ? "#28a745" : "#dc3545";

                // Add event listener to verify button
                verifyButton.addEventListener('click', () => {
                    // Toggle the 'verified' property
                    account.verified = !account.verified;
                    // Update button text and style based opn new 'verified' status
                    verifyButton.textContent = account.verified ? "Verified" : "Not Verified";
                    verifyButton.style.backgroundColor = account.verified ? "#28a745" : "#dc3545";

                    // Save the updated accounts data back to the JSON file
                    saveAccounts(accounts);
                });
                // Append elements to the account container
                accountDiv.appendChild(usernameHeading);
                accountDiv.appendChild(nameparagraph);
                accountDiv.appendChild(passwordParagraph);
                accountDiv.appendChild(roleHeading);
                accountDiv.appendChild(verifyButton);
                accountsContainer.appendChild(accountDiv);
            });
        })
        .catch(error => console.error('Error loading accounts:', error));
}

// Function to save the updated accounts data back to the JSON file
// Function to save the updated accounts data to the Flask endpoint
function saveAccounts(jsonData) {
    fetch('http://localhost:5000/update_json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response from server:', data);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

// Example JSON data to be sent to the server
const jsonData = {
    "username": "newUsername",
    "password": "newPassword",
    "verified": false,
    "role": "Admin"
};
function createAccountData(username, password, role, verified) {
    const data = {
        username: username,
        password: password,
        role: role,
        verified: verified
    };

    fetch('http://localhost:5000/add_account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Account added successfully');
        } else {
            console.error('Failed to add account');
        }
    })
    .catch(error => console.error('Error:', error));
}

function createAccount() {
    const form = document.createElement('form');
    form.classList.add('account-form');

    const usernameInput = document.createElement('input');
    usernameInput.setAttribute('type', 'text');
    usernameInput.setAttribute('name', 'username');
    usernameInput.setAttribute('placeholder', 'Username');
    usernameInput.classList.add('form-input');

    const passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('name', 'password');
    passwordInput.setAttribute('placeholder', 'Password');
    passwordInput.classList.add('form-input');

    const roleInput = document.createElement('input');
    roleInput.setAttribute('type', 'text');
    roleInput.setAttribute('name', 'role');
    roleInput.setAttribute('placeholder', 'Role');
    roleInput.classList.add('form-input');

    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Create Account';
    submitButton.classList.add('submit-button');
    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        createAccountData(usernameInput.value, passwordInput.value, roleInput.value, true);
    });

    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(roleInput);
    form.appendChild(submitButton);

    document.body.appendChild(form);
}




// Call the loadAccounts function when the DOM content is loaded
document.addEventListener('DOMContentLoaded', loadAccounts);

