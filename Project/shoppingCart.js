$(document).ready(function() {
    const token = getCookie('token'); 
    const $cartWrapper = $('#cart-wrapper');

    if (!token) {
        
        $cartWrapper.html(`
            <div class="not-logged-in">
                <h2>You are not logged in.</h2>
                <p>Please log in or create an account to view your shopping cart.</p>
                <button class="login-btn">Log In</button>
                <button class="signup-btn">Sign Up</button>
            </div>
        `);

        $cartWrapper.find('.login-btn').click(() => window.location.href = 'login.html');
        $cartWrapper.find('.signup-btn').click(() => window.location.href = 'signup.html');

        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    $cartWrapper.html(`
        <h1>Shopping Cart</h1>
        <div id="cart-items" class="cart-items"></div>
        <div class="cart-summary">
            <p>Subtotal: $<span id="subtotal">0</span></p>
            <p>Tax (10%): $<span id="tax">0</span></p>
            <p>Total: $<span id="total">0</span></p>
            <button id="checkout-button">Proceed to Checkout</button>
        </div>
        <button id="continue-shopping">Continue Shopping</button>
    `);

    const $cartItems = $('#cart-items');
    const $subtotal = $('#subtotal');
    const $tax = $('#tax');
    const $total = $('#total');

    function renderCart() {
        $cartItems.empty();
        if (cart.length === 0) {
            $cartItems.html('<p>Your cart is empty.</p>');
            $subtotal.text('0');
            $tax.text('0');
            $total.text('0');
            return;
        }

        let subtotal = 0;
        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;

            const $itemDiv = $(`
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price}</p>
                    </div>
                    <input type="number" min="1" value="${item.quantity}" data-index="${index}">
                    <button data-index="${index}">Remove</button>
                </div>
            `);

            $cartItems.append($itemDiv);
        });

        const taxAmount = (subtotal * 0.1).toFixed(2);
        const totalAmount = (subtotal * 1.1).toFixed(2);

        $subtotal.text(subtotal.toFixed(2));
        $tax.text(taxAmount);
        $total.text(totalAmount);
    }

    renderCart();

    $cartItems.on('input', 'input[type="number"]', function() {
        const idx = $(this).data('index');
        cart[idx].quantity = parseInt($(this).val());
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });

    $cartItems.on('click', 'button', function() {
        const idx = $(this).data('index');
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });

    $('#checkout-button').click(() => window.location.href = 'checkout.html');
    $('#continue-shopping').click(() => window.location.href = 'HomePage.html');
});


function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}