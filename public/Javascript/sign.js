let isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";
let fontFamilyPopins = new FontFace("Poppins", "url(https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap)");
function createPopup() {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.2)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1";
  overlay.id = "overlay";

  const loginBox = document.createElement("div");
  loginBox.style.background = "#333";
  loginBox.style.color = "#fff";
  loginBox.style.padding = "20px";
  loginBox.style.borderRadius = "8px";
  loginBox.style.textAlign = "center";
  loginBox.style.fontFamily = "Poppins"; // Change the font-family
  loginBox.id = "login"

  const usernameLabel = document.createElement("label");
  usernameLabel.innerText = "Username:";
  usernameLabel.style.marginRight = "10px";
  usernameLabel.style.fontSize = "15px";
  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "username";
  usernameInput.required = true;
  usernameInput.style.marginBottom = "10px";
  usernameInput.style.fontSize = "15px";
  usernameInput.style.padding = "2px";
  usernameInput.style.outline = "none";
  usernameInput.style.borderRadius = "5px";
  usernameInput.style.border = "1px solid #ccc";
  usernameInput.style.fontFamily = "Poppins";

  const passwordLabel = document.createElement("label");
  passwordLabel.innerText = "Password:";
  passwordLabel.style.marginRight = "10px";
  passwordLabel.style.fontSize = "15px";
  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.required = true;
  passwordInput.style.marginBottom = "20px";
  passwordInput.style.fontSize = "15px";
  passwordInput.style.padding = "2px";
  passwordInput.style.outline = "none";
  passwordInput.style.borderRadius = "5px";
  passwordInput.style.border = "1px solid #ccc";
  passwordInput.style.fontFamily = "Poppins";

  const signInButton = document.createElement("button");
  signInButton.id = "signin-button";
  signInButton.innerText = "Sign Up";
  signInButton.style.fontSize = "15px";
  signInButton.style.color = "white";
  signInButton.style.border = "none";
  signInButton.style.padding = "10px";
  signInButton.style.borderRadius = "5px";
  signInButton.style.cursor = "pointer";
  signInButton.style.backgroundColor = "#454545";
  signInButton.style.marginTop = "10px";
  signInButton.style.marginBottom = "10px";
  signInButton.style.fontFamily = "Poppins";
  signInButton.addEventListener('mouseover', () => {
    signInButton.style.backgroundColor = "rgba(201, 201, 201, 0.37)";
    signInButton.style.transform = "translate(-0%, -3%)";
    signInButton.style.transition = "background-color 0.3s ease-in-out";
  })
  signInButton.addEventListener('mouseout', () => {
    signInButton.style.backgroundColor = "#454545";
    signInButton.style.transform = "translate(0%, 0%)";
    signInButton.style.transition = "background-color 0.3s ease-in-out";
  })

  signInButton.onclick = signUp;

  const errorMessage = document.createElement("p");
  errorMessage.style.color = "red";
  errorMessage.style.marginTop = "10px";
  errorMessage.style.fontFamily = "Poppins";
  errorMessage.style.fontSize = "15px";

  const alreadyaccount = document.createElement("p");
  alreadyaccount.innerText = "Already have an account?";
  alreadyaccount.id = "alreadyaccount";
  alreadyaccount.style.fontSize = "15px";
  alreadyaccount.style.fontFamily = "Poppins";
  alreadyaccount.style.cursor = "pointer";
  alreadyaccount.style.marginTop = "10px";
  alreadyaccount.style.marginBottom = "10px";
  alreadyaccount.addEventListener('click', () => {
      changeTsignIn();
  });


  loginBox.appendChild(document.createElement("h2"));
  loginBox.querySelectorAll("h2")[0].innerText = "Sign Up\n";
  loginBox.querySelectorAll("h2")[0].style.fontSize = "25px";

  loginBox.appendChild(usernameLabel);
  loginBox.appendChild(usernameInput);
  loginBox.appendChild(document.createElement("br"));
  loginBox.appendChild(passwordLabel);
  loginBox.appendChild(passwordInput);
  loginBox.appendChild(document.createElement("br"));
  loginBox.appendChild(signInButton);
  loginBox.appendChild(errorMessage); // Append errorMessage directly to loginBox
  loginBox.appendChild(alreadyaccount);

  overlay.appendChild(loginBox);

  document.body.appendChild(overlay);
}

function removeSignInElements() {
  const loginBox = document.getElementById("login");
  const overlay = document.getElementById("overlay");
  loginBox.remove();
  overlay.remove();
}


function changeTsignIn() {
    const loginBox = document.getElementById("login");
    loginBox.querySelectorAll("h2")[0].innerText = "Sign In\n";
    const button = loginBox.querySelectorAll('button');
    loginBox.removeChild(button[0]);
    const signInbutton = document.createElement("button");
    signInbutton.id = "signin-button";
    signInbutton.innerText = "Sign In";
    signInbutton.style.fontSize = "15px";
    signInbutton.style.color = "white";
    signInbutton.style.border = "none";
    signInbutton.style.padding = "10px";
    signInbutton.style.borderRadius = "5px";
    signInbutton.style.cursor = "pointer";
    signInbutton.style.backgroundColor = "#454545";
    signInbutton.style.marginTop = "10px";
    signInbutton.style.marginBottom = "10px";
    signInbutton.style.fontFamily = "Poppins";
    signInbutton.addEventListener('mouseover', () => {
        signInbutton.style.backgroundColor = "rgba(201, 201, 201, 0.37)";
        signInbutton.style.transform = "translate(-0%, -3%)";
        signInbutton.style.transition = "background-color 0.3s ease-in-out";
    });
    signInbutton.addEventListener('mouseout', () => {
        signInbutton.style.backgroundColor = "#454545";
        signInbutton.style.transform = "translate(0%, 0%)";
        signInbutton.style.transition = "background-color 0.3s ease-in-out";

    });
    loginBox.appendChild(signInbutton);
    const alreadyaccount = document.getElementById("alreadyaccount");
    loginBox.removeChild(alreadyaccount);
    signInbutton.onclick = signIn;
}

function signIn() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    sessionStorage.setItem("isAuthenticated", "true");

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Specify the path to your JSON file
    const url = 'Javascript/users.json';

    // Open a GET request to the JSON file
    xhr.open('GET', url, true);

    // Set up onload function to handle successful response
    xhr.onload = function () {
        // Check if the request was successful
        if (xhr.status === 200) {
            // Parse the JSON response
            const data = JSON.parse(xhr.responseText);

            // Check if the provided username and password match any entry in the JSON array
            const user = data.find(user => user.username === username && user.password === password);

            // If a user with the provided username and password is found
            if (user) {
                if (user.username === "admin") {
                    window.location.href = "admin-page.html";
                }
                // Check if the user is verified
                if (user.verified === true) {
                    removeSignInElements();
                    console.log("Sign in successful");
                }else {
                    // Display error message if the account is not verified
                    const errorMessage = document.querySelector("#overlay p");
                    errorMessage.textContent = "Account not verified";
                    console.log("Account not verified");
                }
            } else {
                // Display error message if the user is not found
                const errorMessage = document.querySelector("#overlay p");
                errorMessage.textContent = "Invalid username or password";
                console.log("Sign in failed");
            }
        } else {
            // Display error message if the request fails
            console.error('Error loading JSON file:', xhr.statusText);
        }
    };

    // Set up onerror function to handle failed request
    xhr.onerror = function () {
        console.error('Error loading JSON file:', xhr.statusText);
    };

    // Send the request
    xhr.send();
}




function signUp() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.querySelector("#overlay p");

    createAccountData(username, password, "User", false);    
}

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
  

function checkAuthentication() {
    if (sessionStorage.getItem("isAuthenticated") === "true") {
        
    }else {
        createPopup();
    }
}

// Initial check on page load
document.addEventListener('DOMContentLoaded', function(){
    checkAuthentication();
});
