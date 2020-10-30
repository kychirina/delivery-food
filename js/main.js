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
const cartClear = document.querySelector(".clear-cart");
const cartList = document.querySelector(".food-list");
const cartTotal = document.querySelector('.modal-pricetag');
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const searchInput = document.querySelector(".input-search");

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
    if(modal.classList.contains('is-open')){
        disableScroll();
    }else{
        enableScroll();
    }
}

const cart = [];

let login = localStorage.getItem('gloDelivery');
let cartLocal = JSON.parse(localStorage.getItem(login));

/* ---------- AUTHORIZED ----------- */
function authorized() {
    function logOut() {
        login = null;
        localStorage.removeItem('gloDelivery');
        authButton.style.display = '';
        outButton.style.display = '';
        userName.style.display = '';
        cartButton.style.display = '';
        outButton.removeEventListener("click", logOut);
        checkAuth();
    }
    userName.textContent = login;
    authButton.style.display = 'none';
    outButton.style.display = 'flex';
    userName.style.display = 'inline';
    cartButton.style.display = 'flex';
    outButton.addEventListener("click", logOut);
}

function notAuthorized() {
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

/* ----------  Search ----------  */
searchInput.addEventListener('keypress', function (event) {
    if(event.keyCode === 13){
        const val = event.target.value.trim().toLowerCase();
        let resLength = 0;
        if(!val){
            event.target.style.borderColor = 'red';
            event.target.value = '';
            setTimeout(function () {
                event.target.style.borderColor = '';
            }, 1500);
            return;
        }
        getData('./db/partners.json')
            .then(function (data) {
                return data.map(function (el) {
                    return el['products'];
                });
            })
            .then(function (listProducts) {
                menuCard.textContent = '';
                listProducts.forEach(function (el) {
                    getData(`./db/${el}`)
                        .then(function (res) {
                            const resSearch = res.filter(function (item) {
                                if(item['name'].toLowerCase().includes(val) || item['description'].toLowerCase().includes(val)){
                                    resLength ++;
                                    return item;
                                }
                            });

                            info.innerHTML = '<h2 class="section-title restaurant-title">Результат поиска: ' + resLength +'</h2>';
                            promo.classList.add("hide");
                            restaurants.classList.add("hide");
                            menu.classList.remove("hide");
                            resSearch.forEach(createCardGood);
                        });
                });
            });

    }
});

/* ----------  Add Cart ----------  */
function addCart(event) {
    const target = event.target;
    const btnCart = target.closest('.button-add-cart');

    if(btnCart){
        const card = target.closest('.card');
        const title = card.querySelector('.card-title').textContent;
        const price = card.querySelector('.card-price-bold').textContent;
        const id = card.getAttribute('id');
        const food = cart.find(function (el) {
            return el.id === id;
        });
        if(food){
            food.count += 1;
        }else{
            cart.push({
                id: id,
                title: title,
                price: price,
                count: 1
            });
            localStorage.setItem(login, JSON.stringify(cart));
        }
    }
}
function renderCart() {
    cartList.textContent = '';
    cartLocal = JSON.parse(localStorage.getItem(login));

    if(cartLocal){
        cartLocal.forEach(function ({ id, title, price, count}) {
            const itemCartList = `
    		<div class="food-row">
				<span class="food-name">${title}</span>
				<strong class="food-price">${price}</strong>
				<div class="food-counter">
					<button class="counter-button counter-minus" data-id="${id}">-</button>
					<span class="counter">${count}</span>
					<button class="counter-button counter-plus" data-id="${id}">+</button>
				</div>
			</div>
        `;
            cartList.insertAdjacentHTML('afterbegin', itemCartList);
        });

        const priceTotal = cartLocal.reduce(function (result, item) {
            return result + (parseFloat(item.price) * item.count);
        }, 0);
        cartTotal.textContent = priceTotal + ' ₽';
    }else{
        cartTotal.textContent = '0 ₽';
    }
}
function changeCount(event) {
    const target = event.target;
    const food = cart.find(function (el) {
        return el.id === target.dataset.id;
    });
    if(target.classList.contains('counter-minus')){
        food.count --;
        if(food.count === 0){
            cart.splice(cart.indexOf(food),1);
        }
    }
    if(target.classList.contains('counter-plus')) food.count ++;
    localStorage.setItem(login, JSON.stringify(cart));
    renderCart();
}

function init(){
    cardRestaurants.addEventListener('click', openGoods);

    /* ---------- Return home ----------- */
    logo.addEventListener('click', function () {
        promo.classList.remove("hide");
        restaurants.classList.remove("hide");
        menu.classList.add("hide");
    });

    /* ---------- Cart ----------- */
    // open and init cart
    cartButton.addEventListener("click", function () {
        renderCart();
        toggleModal();
    });
    // change count cart
    cartList.addEventListener("click", changeCount);
    // clear cart
    cartClear.addEventListener("click", function () {
        cart.length = 0;
        cartLocal = null;
        localStorage.removeItem(login);
        renderCart();
        toggleModal();
    });
    // add goods in cart
    menuCard.addEventListener("click", addCart);

    close.addEventListener("click", toggleModal);

    authButton.addEventListener("click", clearForm);

    checkAuth();

    /* ----------  Get Data for Cards ----------  */
    getData('./db/partners.json').then(function (data) {
        data.forEach(createCards);
    });
}

/* ----------  Initialization Page ----------  */
init();



