$(document).ready(function () {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCart() {
        renderCartItems();
        const totals = calculateTotals();
        renderTotals(totals);
        togglePlaceOrderButton();
    }

    function renderCartItems() {
        const $cartItems = $("#cartItems");
        $cartItems.empty();

        cart.forEach(item => {
            $cartItems.append(
                `<div>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</div>`
            );
        });
    }

    function renderTotals({ subtotal, tax, deliverySurcharge, total }) {
        $("#subtotal").text(subtotal.toFixed(2));
        $("#tax").text(tax.toFixed(2));
        $("#total").text(total.toFixed(2));
        $("#deliveryFee").text(`Delivery Fee: $${deliverySurcharge.toFixed(2)}`);
    }

    function togglePlaceOrderButton() {
        $("#placeOrderBtn").prop("disabled", cart.length === 0);
    }

    function calculateTotals() {
        let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const deliveryOption = $("#delivery").val();
        let deliverySurcharge = deliveryOption === "express" ? subtotal * 0.05 : 0;

        const tax = subtotal * 0.10;
        const total = subtotal + tax + deliverySurcharge;

        return { subtotal, tax, deliverySurcharge, total };
    }

    function validateForm() {
        const fields = ["#fullName", "#email", "#phone", "#address", "#city", "#postal"];
        for (const selector of fields) {
            if (!$(selector).val().trim()) {
                return false;
            }
        }
        return true;
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            $("#formMessage").text("Please fill in all fields").css("color", "red");
            return;
        }

        const orderData = {
            cart,
            fullName: $("#fullName").val().trim(),
            delivery: $("#delivery").val(),
            total: $("#total").text()
        };

        localStorage.setItem("lastOrder", JSON.stringify(orderData));
        localStorage.removeItem("cart");
        window.location.href = "OrderConfirmationpage.html";
    }

    function setupBackButton() {
        $("#backBtn").on("click", () => window.history.back());
    }

    function init() {
        renderCart();
        $("#delivery").on("change", renderCart);
        $("#checkoutForm").on("submit", handleFormSubmit);
        setupBackButton();
    }

    init();
});
