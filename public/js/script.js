
var modal = document.getElementById("modal");



var loginBtn = document.getElementById("login-btn");
var showRegisterBtn = document.getElementById("show-register-btn");
var showLoginBtn = document.getElementById("show-login-btn");



var span = document.getElementsByClassName("close")[0];

var loginForm = document.getElementById("login-form");
var registerForm = document.getElementById("register-form");
var userNameSpan = document.getElementById("user-name");
loginBtn.onclick = function (event) {
    event.preventDefault();
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    modal.style.display = "flex";
}


showRegisterBtn.onclick = function (event) {
    event.preventDefault();
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
}


showLoginBtn.onclick = function (event) {
    event.preventDefault();
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
}


span.onclick = function () {
    modal.style.display = "none";
}


window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


document.getElementById('login').onsubmit = async function (event) {
    event.preventDefault();
    var username = document.getElementById('login-username').value;
    var password = document.getElementById('login-password').value;

    const response = await fetch('http://localhost:1337/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.text();
    console.log(result);
    alert(result);

    if (response.ok) {
        
        modal.style.display = "none";
        
        loginBtn.innerText = username;
    } else {
        alert('Login failed');
    }
}

window.onload = async function () {
    const response = await fetch('http://localhost:1337/session');
    const result = await response.json();
    if (result.loggedIn) {
        loginBtn.innerText = result.user.username;
    }
}



document.getElementById('register').onsubmit = async function (event) {
    event.preventDefault();
    var username = document.getElementById('register-username').value;
    var password = document.getElementById('register-password').value;
    var email = document.getElementById('user-email').value;
   
    const response = await fetch('http://localhost:1337/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    });

    const result = await response.text();
    console.log(result);
    alert(result);
    

    
    modal.style.display = "none";
}


function showDropdown() {
    document.querySelector('.dropdown-content').style.display = 'block';
}

function closeDropdown() {
    document.querySelector('.dropdown-content').style.display = 'none';
}

const closeBtn = document.querySelector(".close");



