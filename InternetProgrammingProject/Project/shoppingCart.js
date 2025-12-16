$(document).ready(function() {
    const token = getCookie('token'); 
    const $cartWrapper = $('#cart-wrapper');
    const $breadcrumb = $('#breadcrumb');
    const $cartBadge = $('.icon-cart .badge');

    $breadcrumb.html(`
        <a href="HomePage.html">Home</a> &gt; 
        <span class="breadcrumb-current">Shopping Cart</span>
    `);

    if (!token) {
        $cartWrapper.html(`
            <div class="not-logged-in">
                <h2>You are not logged in.</h2>
                <p>Please log in or create an account to view your shopping cart.</p>
                <div class="button-container">
                    <button class="login-btn">Log In</button>
                    <button class="signup-btn">Sign Up</button>
                </div>
            </div>
        `);

        $cartWrapper.find('.login-btn').click(() => window.location.href = 'login.html');
        $cartWrapper.find('.signup-btn').click(() => window.location.href = 'signup.html');
        return;
    }

    let cart = loadCart();

    $cartWrapper.html(`
        <div class="cart-items" id="cart-items"></div>
        <div class="cart-summary">
            <div>
                <p>Subtotal: $<span id="subtotal">0</span></p>
                <p>Tax (10%): $<span id="tax">0</span></p>
                <p>Total: $<span id="total">0</span></p>
            </div>
            <div class="cart-buttons">
                <button id="checkout-button">Proceed to Checkout</button>
                <button id="continue-shopping">Continue Shopping</button>
            </div>
        </div>
    `);

    const $cartItems = $('#cart-items');
    const $subtotal = $('#subtotal');
    const $tax = $('#tax');
    const $total = $('#total');
    const $checkoutButton = $('#checkout-button');

    function updateBadge() {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        $cartBadge.text(totalItems);
    }

    function renderCart() {
        $cartItems.empty();

        if (cart.length === 0) {
            $cartItems.html('<p><strong>Your cart is empty.</strong></p>');
            $subtotal.text('0.00');
            $tax.text('0.00');
            $total.text('0.00');
            $checkoutButton.prop('disabled', true).css({ opacity: '0.5', cursor: 'not-allowed' });
        } else {
            let subtotal = 0;

            cart.forEach((item, index) => {
                subtotal += item.price * item.quantity;

                const $itemDiv = $(`
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)}</p>
                        </div>
                        <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                        <button class="remove-btn" data-index="${index}">Remove</button>
                    </div>
                `);

                $cartItems.append($itemDiv);
            });

            const taxAmount = (subtotal * 0.1).toFixed(2);
            const totalAmount = (subtotal * 1.1).toFixed(2);

            $subtotal.text(subtotal.toFixed(2));
            $tax.text(taxAmount);
            $total.text(totalAmount);

            $checkoutButton.prop('disabled', false).css({ opacity: '1', cursor: 'pointer' });
        }

        saveCart(cart);
        updateBadge(); 
    }

    renderCart();

    $cartItems.on('input', 'input[type="number"]', function() {
        const idx = $(this).data('index');
        const newQty = parseInt($(this).val());
        if (!isNaN(newQty) && newQty > 0) {
            cart[idx].quantity = newQty;
            renderCart(); 
        }
    });

    $cartItems.on('click', '.remove-btn', function() {
        const idx = $(this).data('index');
        if (idx !== undefined) {
            cart.splice(idx, 1);
            renderCart(); 
        }
    });

    $('#checkout-button').click(() => window.location.href = 'checkout.html');
    $('#continue-shopping').click(() => window.location.href = 'HomePage.html');
});

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    setCookie('cart', JSON.stringify(cart), 7); 
}

function loadCart() {
    let cart = JSON.parse(localStorage.getItem('cart') || 'null');
    if (!cart) {
        const cartCookie = getCookie('cart');
        if (cartCookie) cart = JSON.parse(cartCookie);
        else cart = [];
        localStorage.setItem('cart', JSON.stringify(cart)); 
    }
    return cart;
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(";").shift());
    return null;
}
