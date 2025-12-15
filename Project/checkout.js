$(document).ready(function () {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        const cartItems = $("#cartItems");
        cartItems.empty();

        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            cartItems.append(`<div>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</div>`);
        });

        const tax = subtotal * 0.10; 
        const total = subtotal + tax;

        $("#subtotal").text(subtotal.toFixed(2));
        $("#tax").text(tax.toFixed(2));
        $("#total").text(total.toFixed(2));
    }

    renderCart();

    $("#checkoutForm").on("submit", function (e) {
        e.preventDefault();

        const fullName = $("#fullName").val().trim();
        const email = $("#email").val().trim();
        const phone = $("#phone").val().trim();
        const address = $("#address").val().trim();
        const city = $("#city").val().trim();
        const postal = $("#postal").val().trim();

        if (!fullName || !email || !phone || !address || !city || !postal) {
            $("#formMessage").text("Please fill in all fields");
            return;
        }


        localStorage.setItem("lastOrder", JSON.stringify({ cart, fullName, total: $("#total").text() }));
        localStorage.removeItem("cart");
        window.location.href = "confirmOrder.html";
    });

});


function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}