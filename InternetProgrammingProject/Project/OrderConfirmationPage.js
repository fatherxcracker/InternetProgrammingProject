$(document).ready(function() {

    const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));

    localStorage.removeItem("cart");
    deleteCookie("cart");

    if (!lastOrder) {
        $("#order-items").html("<p>No recent order found.</p>");
        $("#total-price").text("0.00");
        $("#order-number").text("N/A");
        return;
    }

    const orderNumber = "JTV" + Math.floor(Math.random() * 900000 + 100000);
    $("#order-number").text(orderNumber);

    const $orderItems = $("#order-items");
    lastOrder.cart.forEach(item => {
        $orderItems.append(`
            <div class="order-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `);
    });

    $("#total-price").text(lastOrder.total);

    $("#return-home").on("click", function() {
        window.location.href = "HomePage.html";
    });
});

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
