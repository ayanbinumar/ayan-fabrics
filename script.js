
// AYAN FABRICS - SHOPPING STORE

// PRODUCT DATABASE
const products = {
    1: {
        name: "Classic Men's Fabric",
        price: 2500
    },
    2: {
        name: "Elegant Women's Fabric",
        price: 3200
    },
    3: {
        name: "Signature Premium Fabric",
        price: 4500
    },
    4: {
        name: "Exclusive Fabric",
        price: 3800
    }
};

// CART STORAGE
let cart = {};

try {
    cart = JSON.parse(localStorage.getItem("ayanCart")) || {};
} catch (error) {
    cart = {};
}

// ELEMENTS
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

// FORMAT PRICE
function formatPrice(price) {
    return "Rs. " + price.toLocaleString("en-PK");
}

// SAVE CART
function saveCart() {
    try {
        localStorage.setItem("ayanCart", JSON.stringify(cart));
    } catch (error) {
        console.warn("Cart could not be saved.");
    }
}

// ADD PRODUCT
document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", function() {

        const id = this.dataset.id;

        if (!products[id]) return;

        cart[id] = (cart[id] || 0) + 1;

        saveCart();
        updateCart();

        this.textContent = "ADDED ✓";

        setTimeout(() => {
            this.textContent = "ADD TO BAG +";
        }, 1000);

    });

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

        item.innerHTML = `
            <div>
                <h3>${product.name}</h3>
                <p>${formatPrice(product.price)} each</p>
                <strong>${formatPrice(subtotal)}</strong>
            </div>

            <div class="quantity-control">
                <button data-action="minus" data-id="${id}">−</button>
                <span>${quantity}</span>
                <button data-action="plus" data-id="${id}">+</button>
            </div>

            <button class="remove-item" data-action="remove" data-id="${id}">
                REMOVE
            </button>
        `;

        cartItems.appendChild(item);
    }

    if (totalItems === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your shopping bag is currently empty.</p>';
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

// OPEN CART
document.getElementById("cartButton").addEventListener("click", function() {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
});

// WHATSAPP CHECKOUT
checkoutBtn.addEventListener("click", function() {

    let message = "Hello AYAN FABRICS!\n";
    message += "I would like to place an order:\n\n";

    let total = 0;

    for (const id in cart) {

        const product = products[id];
        const quantity = cart[id];

        if (!product || quantity <= 0) continue;

        const subtotal = product.price * quantity;
        total += subtotal;

        message +=
            product.name +
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

// CLOSE MENU AFTER NAVIGATION
document.querySelectorAll(".navbar a").forEach(link => {

    link.addEventListener("click", closeMenu);

});

// CLOSE MENU ON OUTSIDE CLICK
document.addEventListener("click", function(event) {

    if (
        !navbar.contains(event.target) &&
        !menuToggle.contains(event.target)
    ) {
        closeMenu();
    }

});

// CLOSE MENU WITH ESCAPE
document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeMenu();
    }

});

function closeMenu() {

    navbar.classList.remove("active");

    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");

}

// INITIALIZE WEBSITE
updateCart();

console.log("AYAN FABRICS Store Loaded Successfully!");
