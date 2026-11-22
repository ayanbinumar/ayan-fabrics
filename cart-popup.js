
/* AYAN BIN UMAR - MINI CART POPUP */

let popupTimer;

export function showCartPopup(product, quantity, totalItems) {

    let popup = document.getElementById("miniCartPopup");

    if (!popup) {

        const style = document.createElement("style");

        style.textContent = `
            #miniCartPopup {
                position: fixed;
                top: 85px;
                right: 20px;
                width: min(360px, calc(100vw - 30px));
                background: #10271e;
                color: #e8d5a5;
                border: 1px solid #c5a45e;
                padding: 20px;
                z-index: 999999;
                box-shadow: 0 8px 30px rgba(0,0,0,.45);
                display: none;
                font-family: Georgia, serif;
            }

            #miniCartPopup.active {
                display: block;
                animation: cartPopupIn .25s ease;
            }

            @keyframes cartPopupIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .mini-cart-heading {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #927b49;
                padding-bottom: 12px;
            }

            .mini-cart-heading strong {
                letter-spacing: 1px;
            }

            .mini-cart-close {
                background: none;
                border: none;
                color: #e8d5a5;
                font-size: 25px;
                cursor: pointer;
            }

            .mini-cart-product {
                display: flex;
                gap: 14px;
                align-items: center;
                padding: 18px 0;
            }

            .mini-cart-product img {
                width: 75px;
                height: 85px;
                object-fit: cover;
                border: 1px solid #927b49;
            }

            .mini-cart-product h4 {
                margin: 0 0 8px;
                font-size: 15px;
            }

            .mini-cart-product p {
                margin: 5px 0;
                font-size: 13px;
            }

            .mini-cart-total {
                border-top: 1px solid #927b49;
                padding-top: 12px;
                font-size: 14px;
            }

            .mini-cart-actions {
                display: flex;
                gap: 10px;
                margin-top: 16px;
            }

            .mini-cart-actions button {
                flex: 1;
                padding: 11px 5px;
                cursor: pointer;
                font-size: 11px;
                font-weight: bold;
                letter-spacing: .5px;
            }

            .mini-view-bag {
                background: #c5a45e;
                color: #071b14;
                border: 1px solid #c5a45e;
            }

            .mini-continue {
                background: transparent;
                color: #e8d5a5;
                border: 1px solid #c5a45e;
            }

            @media(max-width: 480px) {
                #miniCartPopup {
                    top: 70px;
                    right: 10px;
                }
            }
        `;

        document.head.appendChild(style);

        popup = document.createElement("div");
        popup.id = "miniCartPopup";

        document.body.appendChild(popup);
    }

    const formatPrice = price =>
        "Rs. " + Number(price || 0).toLocaleString("en-PK");

    popup.innerHTML = "";

    const heading = document.createElement("div");
    heading.className = "mini-cart-heading";

    const title = document.createElement("strong");
    title.textContent = "✓ ADDED TO YOUR BAG";

    const close = document.createElement("button");
    close.className = "mini-cart-close";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close shopping bag popup");

    close.onclick = () => popup.classList.remove("active");

    heading.append(title, close);

    const productBox = document.createElement("div");
    productBox.className = "mini-cart-product";

    if (product.imageUrl) {
        const image = document.createElement("img");
        image.src = product.imageUrl;
        image.alt = product.name || "Product";
        productBox.appendChild(image);
    }

    const details = document.createElement("div");

    const name = document.createElement("h4");
    name.textContent = product.name || "Fabric";

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price);

    const qty = document.createElement("p");
    qty.textContent = "Quantity: " + quantity;

    details.append(name, price, qty);
    productBox.appendChild(details);

    const total = document.createElement("div");
    total.className = "mini-cart-total";
    total.textContent = "Total items in bag: " + totalItems;

    const actions = document.createElement("div");
    actions.className = "mini-cart-actions";

    const viewBag = document.createElement("button");
    viewBag.className = "mini-view-bag";
    viewBag.textContent = "VIEW BAG";

    viewBag.onclick = () => {
        window.location.href = "cart.html";
    };

    const continueShopping = document.createElement("button");
    continueShopping.className = "mini-continue";
    continueShopping.textContent = "CONTINUE";

    continueShopping.onclick = () => {
        popup.classList.remove("active");
    };

    actions.append(viewBag, continueShopping);

    popup.append(heading, productBox, total, actions);

    popup.classList.add("active");

    clearTimeout(popupTimer);

    popupTimer = setTimeout(() => {
        popup.classList.remove("active");
    }, 5000);

}
