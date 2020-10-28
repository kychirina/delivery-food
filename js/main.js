const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

window.disableScroll = function(){
    const widthScroll = window.innerWidth - document.body.offsetWidth;
    document.body.dbScrollY = window.scrollY;
    document.body.style.cssText = `
        position: fixed;
        top: ${-window.scrollY}px;
        left: 0;
        overflow: hidden;
        width: 100vw;
        height: 100vh; 
        padding-right: ${widthScroll}px;     
    `
}
window.enableScroll = function(){
    document.body.style.cssText = '';
    window.scroll({top: document.body.dbScrollY});
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
            clearForm();
        }else{
            loginInput.style.borderColor = 'red';
        }
        checkAuth();
    }
    authButton.addEventListener("click", toggleModalAuth);
    authClose.addEventListener("click", toggleModalAuth);
    loginForm.addEventListener("submit", logIn);
    authModal.addEventListener("click", function (event) {
        if(event.target.classList.contains('is-open')){
            toggleModalAuth();
        }
    });
}

function toggleModalAuth() {
    authModal.classList.toggle("is-open");
    if(authModal.classList.contains('is-open')){
        disableScroll();
    }else{
        enableScroll();
    }
}

function clearForm() {
    loginForm.reset();
    loginInput.style.borderColor = '';
}

function checkAuth() {
    if(login){
        authorized();
    }else{
        notAuthorized();
    }
}

authButton.addEventListener("click", clearForm);

if(authModal){
    checkAuth();
}
