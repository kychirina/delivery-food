'use strict';

/* ---------- FOR SCROLL ----------- */

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

/* ----------  SLIDER ----------  */

new Swiper('.swiper-container', {
    slidesPerView: 1,
    grabCursor: true,
    loop: true,
    autoplay: {
        delay: 5000,
        disableoninteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

/* ---------- FOR DELIVERY FOOD ----------- */

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
const info = document.querySelector('.info-menu');
const menuCard = document.querySelector('.cards-menu');
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const getData = async function (url) {
    const response = await fetch(url);

    if(!response.ok){
        throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}.`);
    }
    return await response.json();
};

const toggleModalAuth = function() {
    authModal.classList.toggle("is-open");
    if(authModal.classList.contains('is-open')){
        disableScroll();
    }else{
        enableScroll();
    }
}

const toggleModal = function() {
    modal.classList.toggle("is-open");
}

let login = localStorage.getItem('gloDelivery');

/* ---------- AUTHORIZED ----------- */
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

/* ---------- Add Cards ----------- */
function createCards({ image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery }) {

    const cardItem = `
    	<div class="card card-restaurant" data-products="${products}">
			<img src="${image}" alt="image" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery} мин.</span>
				</div>
				<div class="card-info">
					<div class="rating">${stars}</div>
					<div class="price">от ${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
			</div>
		</div>
    `;

    cardRestaurants.insertAdjacentHTML('beforeend', cardItem);
}

/* ---------- Add Goods ----------- */
function createCardGood({ id, name, price, description, image }) {

    const card = document.createElement('div');

    card.className = 'card';
    card.setAttribute('id', id);
    card.insertAdjacentHTML('beforeend', `
		<img src="${image}" alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price-bold">${price} ₽</strong>
			</div>
		</div>
    `);
    menuCard.insertAdjacentElement('beforeend', card);
}
/* ---------- Add Information of Restaurant ----------- */
function createInfoRestaurant({ kitchen, name, price, stars }) {
    info.insertAdjacentHTML('beforeend', `
		<h2 class="section-title restaurant-title">${name}</h2>
		<div class="card-info">
			<div class="rating">${stars}</div>
			<div class="price">От ${price} ₽</div>
			<div class="category">${kitchen}</div>
		</div>
    `);
}

function openGoods(event){
    const e = event.target;

    if(login){
        const restaurant = e.closest('.card-restaurant');
        if(restaurant){
            info.textContent = '';
            menuCard.textContent = '';
            promo.classList.add("hide");
            restaurants.classList.add("hide");
            menu.classList.remove("hide");

            /* ----------  Get Data for Information of Restaurant ----------  */
            getData('./db/partners.json').then(function (data) {
                data.forEach(function (el) {
                    if(restaurant.dataset.products == el['products']){
                        createInfoRestaurant(el);
                    }
                });
            });

            /* ----------  Get Data for Goods ----------  */
            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood);
            });
        }
    }else{
        toggleModalAuth();
    }
}

cardRestaurants.addEventListener('click', openGoods);

/* ---------- Return home ----------- */
logo.addEventListener('click', function () {
    promo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
});

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

authButton.addEventListener("click", clearForm);

checkAuth();

/* ----------  Get Data for Cards ----------  */
getData('./db/partners.json').then(function (data) {
    data.forEach(createCards);
});


