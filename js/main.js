const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

/* ---------- DAY 1 ----------- */

const authButton = document.querySelector('.button-auth');
const outButton = document.querySelector('.button-out');
const authModal = document.querySelector('.modal-auth');
const authClose = document.querySelector(".close-auth");
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');

let login = localStorage.getItem('gloDelivery');


function authorized() {
    console.log('Авторизован');
    function logOut() {
        login = null;
        localStorage.removeItem('gloDelivery');
        authButton.style.display = '';
        outButton.style.display = '';
        userName.style.display = '';
        outButton.removeEventListener("click", logOut);
        checkAuth();
    }
    userName.textContent = login;
    authButton.style.display = 'none';
    outButton.style.display = 'block';
    userName.style.display = 'inline';
    outButton.addEventListener("click", logOut);
}

function notAuthorized() {
    console.log('Не авторизован');
    function logIn(event) {
        event.preventDefault();
        login = loginInput.value;
        localStorage.setItem('gloDelivery', login);
        authButton.removeEventListener("click", toggleModalAuth);
        authClose.removeEventListener("click", toggleModalAuth);
        loginForm.removeEventListener("submit", logIn);
        if(login){
            toggleModalAuth();
            loginForm.reset();
            loginInput.style.border = '';
        }else{
            //alert('Введите логин');
            loginInput.style.border = '1px solid red';
        }
        checkAuth();
    }
    authButton.addEventListener("click", toggleModalAuth);
    authClose.addEventListener("click", toggleModalAuth);
    loginForm.addEventListener("submit", logIn);

}

function toggleModalAuth() {
    authModal.classList.toggle("is-open");
}

function checkAuth() {
    if(login){
        authorized();
    }else{
        notAuthorized();
    }
}

checkAuth();