
/* AYAN BIN UMAR - FIREBASE STORE */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";


// FIREBASE CONFIGURATION

const firebaseConfig = {
    apiKey: "AIzaSyDNF25tETO1V208NMwkMsVCQ4caksa_Goo",
    authDomain: "ayan-bin-umar-fabrics.firebaseapp.com",
    projectId: "ayan-bin-umar-fabrics",
    storageBucket: "ayan-bin-umar-fabrics.firebasestorage.app",
    messagingSenderId: "472203328513",
    appId: "1:472203328513:web:3de6e17dc8379431b49400",
    measurementId: "G-5JQ417GF6E"
};


// CONNECT FIREBASE

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// PRODUCTS AND CART

let products = {};
let cart = {};

try {
    cart = JSON.parse(localStorage.getItem("ayanCart")) || {};
} catch (error) {
    cart = {};
}


// WEBSITE ELEMENTS

const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");


// FORMAT PRICE

function formatPrice(price) {
    return "Rs. " + Number(price).toLocaleString("en-PK");
}


// SAVE CART

function saveCart() {
    localStorage.setItem("ayanCart", JSON.stringify(cart));
}


// LOAD PRODUCTS FROM FIREBASE

async function loadProducts() {

    productsContainer.textContent = "Loading products...";

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        products = {};

        snapshot.forEach((document) => {

            const data = document.data();

            products[document.id] = {
                name: data.name || "Fabric",
                price: Number(data.price) || 0,
                imageUrl: data.image || data.imageUrl || "",
                description: data.description || "Premium Quality Fabrics",
                status: data.status || "available"
            };

        });

        displayProducts();
        updateCart();

    } catch (error) {

        console.error("Firebase error:", error);

        productsContainer.textContent =
            "Products could not be loaded. Please try again later.";

    }

}


// DISPLAY PRODUCTS

function displayProducts() {

    productsContainer.innerHTML = "";

    const productIds = Object.keys(products);

    if (productIds.length === 0) {

        productsContainer.textContent = "No products available yet.";
        return;

    }

    productIds.forEach((id) => {

        const product = products[id];

        const card = document.createElement("div");
        card.className = "product";
        card.dataset.id = id;
        card.style.cursor = "pointer";

        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        if (product.imageUrl) {

            const image = document.createElement("img");

            image.src = product.imageUrl;
            image.alt = product.name;
            image.loading = "lazy";

            image.onerror = function() {
                image.style.display = "none";
            };

            image.addEventListener("click", function(event) {
                event.stopPropagation();
                openLightbox(product.imageUrl, product.name);
            });

            imageBox.appendChild(image);

        }

        const info = document.createElement("div");
        info.className = "product-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("strong");
        price.textContent = formatPrice(product.price);

        const button = document.createElement("button");

        button.className = "add-cart";
        button.dataset.id = id;

        if (product.status === "available") {
            button.textContent = "ADD TO BAG +";
        } else {
            button.textContent = "SOLD OUT";
            button.disabled = true;
        }

        bottom.append(price, button);
        info.append(name, description, bottom);
        card.append(imageBox, info);

        productsContainer.appendChild(card);

    });

}


// IMAGE LIGHTBOX

function openLightbox(imageUrl, imageName) {

    let lightbox = document.getElementById("storeLightbox");

    if (!lightbox) {

        lightbox = document.createElement("div");

        lightbox.id = "storeLightbox";

        lightbox.style.cssText = `
            display:none;
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.94);
            z-index:99999;
            align-items:center;
            justify-content:center;
            padding:20px;
        `;

        lightbox.innerHTML = `
            <button id="storeLightboxClose"
                style="position:absolute;top:15px;right:25px;
                font-size:40px;color:white;background:none;
                border:none;cursor:pointer;">×</button>

            <img id="storeLightboxImage"
                style="max-width:95%;max-height:90vh;
                object-fit:contain;">
        `;

        document.body.appendChild(lightbox);

        lightbox.addEventListener("click", function(event) {
            if (
                event.target === lightbox ||
                event.target.id === "storeLightboxClose"
            ) {
                lightbox.style.display = "none";
            }
        });

    }

    const lightboxImage = document.getElementById("storeLightboxImage");

    lightboxImage.src = imageUrl;
    lightboxImage.alt = imageName;

    lightbox.style.display = "flex";

}


// PRODUCT CARD CLICK

productsContainer.addEventListener("click", function(event) {

    const button = event.target.closest(".add-cart");

    if (button) {

        if (button.disabled) return;

        const id = button.dataset.id;
        const product = products[id];

        if (!product || product.status !== "available") return;

        cart[id] = (Number(cart[id]) || 0) + 1;

        saveCart();
        updateCart();

        button.textContent = "ADDED ✓";

        setTimeout(() => {
            if (button.isConnected && product.status === "available") {
                button.textContent = "ADD TO BAG +";
            }
        }, 1000);

        return;
    }

    const card = event.target.closest(".product");

    if (card) {
        const id = card.dataset.id;
        window.location.href =
            "product.html?id=" + encodeURIComponent(id);
    }

});


// UPDATE CART

function updateCart() {

    let totalItems = 0;
    let totalPrice = 0;

    cartItems.innerHTML = "";

    for (const id in cart) {

        const product = products[id];
        const quantity = Number(cart[id]);

        if (!product || !Number.isInteger(quantity) || quantity <= 0) {
            delete cart[id];
            continue;
        }

        totalItems += quantity;

        const subtotal = product.price * quantity;
        totalPrice += subtotal;

        const item = document.createElement("div");
        item.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = product.name;

        const eachPrice = document.createElement("p");
        eachPrice.textContent = formatPrice(product.price) + " each";

        const subtotalText = document.createElement("strong");
        subtotalText.textContent = formatPrice(subtotal);

        details.append(name, eachPrice, subtotalText);

        const controls = document.createElement("div");
        controls.className = "quantity-control";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.dataset.action = "minus";
        minus.dataset.id = id;

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.dataset.action = "plus";
        plus.dataset.id = id;

        controls.append(minus, quantityText, plus);

        const remove = document.createElement("button");
        remove.className = "remove-item";
        remove.textContent = "REMOVE";
        remove.dataset.action = "remove";
        remove.dataset.id = id;

        item.append(details, controls, remove);
        cartItems.appendChild(item);

    }

    if (totalItems === 0) {

        const empty = document.createElement("p");
        empty.className = "empty-cart";
        empty.textContent = "Your shopping bag is currently empty.";

        cartItems.appendChild(empty);

    }

    cartCount.textContent = totalItems;
    cartTotal.textContent = formatPrice(totalPrice);

    checkoutBtn.disabled = totalItems === 0;

    saveCart();

}


// CART BUTTON ACTIONS

cartItems.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (!products[id] || !cart[id]) return;

    if (action === "plus") {
        cart[id]++;
    }

    if (action === "minus") {
        cart[id]--;

        if (cart[id] <= 0) {
            delete cart[id];
        }
    }

    if (action === "remove") {
        delete cart[id];
    }

    updateCart();

});


// OPEN SHOPPING BAG

document.getElementById("cartButton").addEventListener("click", function() {

    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });

});


// WHATSAPP CHECKOUT

checkoutBtn.addEventListener("click", function() {

    let message = "Hello AYAN BIN UMAR!\n";
    message += "I would like to place an order:\n\n";

    let total = 0;

    for (const id in cart) {

        const product = products[id];
        const quantity = cart[id];

        if (!product || quantity <= 0) continue;

        const subtotal = product.price * quantity;
        total += subtotal;

        message += product.name +
            "\nQuantity: " + quantity +
            "\nPrice: " + formatPrice(subtotal) +
            "\n\n";

    }

    if (total <= 0) return;

    message += "Total: " + formatPrice(total);
    message += "\n\nPlease confirm availability and delivery details.";
    message += "\nThank you!";

    const phone = "923219662393";

    const whatsappURL =
        "https://wa.me/" + phone +
        "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

});


// MOBILE MENU

menuToggle.addEventListener("click", function() {

    const isOpen = navbar.classList.toggle("active");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close menu" : "Open menu"
    );

});


// CLOSE MENU

function closeMenu() {

    navbar.classList.remove("active");
    menuToggle.textContent = "☰";

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

}

document.querySelectorAll(".navbar a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("click", function(event) {

    if (
        !navbar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        closeMenu();
    }

});

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeMenu();

        const lightbox = document.getElementById("storeLightbox");

        if (lightbox) {
            lightbox.style.display = "none";
        }
    }

});


// START WEBSITE

loadProducts();

console.log("AYAN BIN UMAR Store Loaded Successfully!");

// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("AYAN BIN UMAR app is ready!");
            })
            .catch((error) => {
                console.error("Service Worker Error:", error);
            });
    });
}
