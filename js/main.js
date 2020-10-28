'use strict';

const logo = document.querySelector('.logo');
const authButton = document.querySelector('.button-auth');
const outButton = document.querySelector('.button-out');
const authModal = document.querySelector('.modal-auth');
const authClose = document.querySelector(".close-auth");
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const cardRestaurants = document.querySelector('.cards-restaurants');
const promo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const menuCard = document.querySelector('.cards-menu');
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

let login = localStorage.getItem('gloDelivery');

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

function toggleModal() {
    modal.classList.toggle("is-open");
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

/* ---------- DAY 2 ----------- */

function createCards() {
    const cardItem = `
    	<a href="restaurant.html" class="card card-restaurant">
			<img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">Пицца плюс11</h3>
					<span class="card-tag tag">50 мин</span>
				</div>
				<div class="card-info">
					<div class="rating">4.5</div>
					<div class="price">От 900 ₽</div>
					<div class="category">Пицца</div>
				</div>
			</div>
		</a>
    `;

    cardRestaurants.insertAdjacentHTML('beforeend', cardItem);
}

function createCardGood() {
    const card = document.createElement('div');

    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
		<img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">Пицца Классика</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы.</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">510 ₽</strong>
			</div>
		</div>
    `);
    menuCard.insertAdjacentElement('beforeend', card);
}

function openGoods(event){
    const e = event.target;
    const restaurant = e.closest('.card-restaurant');

    event.preventDefault();
    if(restaurant){
        menuCard.textContent = '';
        promo.classList.add("hide");
        restaurants.classList.add("hide");
        menu.classList.remove("hide");
        createCardGood();
    }
}

cardRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function () {
    promo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
});

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

authButton.addEventListener("click", clearForm);

checkAuth();

createCards();