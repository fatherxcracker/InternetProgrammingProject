$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id'); 

    if (!productId) {
        showError('.product-details-container', 'No product selected.');
        return;
    }

    loadProduct(productId);
    setupAddToCart();
    loadReviews(productId);

    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        var headerHeight = $('header').outerHeight(); 
        $('html, body').animate({
            scrollTop: $(target).offset().top - headerHeight
        }, 600);
    });

    function showError(container, message) {
        $(container).html(`<p style="color:red;">${message}</p>`);
    }

    function loadProduct(id) {
        $.getJSON('data/products.json')
            .done(function (allProducts) {
                const product = allProducts.find(p => p.id == id);
                if (!product) {
                    showError('.product-details-container', 'Product not found.');
                    return;
                }

                displayProduct(product);
                renderRelatedProducts(allProducts, product);
                renderBreadcrumb(product);
            })
            .fail(function () {
                showError('.product-details-container', 'Failed to load product data.');
            });
    }

    function renderBreadcrumb(product) {
        const $breadcrumb = $('#breadcrumb');
        $breadcrumb.empty();
        $breadcrumb.append(`<a href="HomePage.html">Home</a> &gt; `);
        $breadcrumb.append(`<a href="ProductListingPage.html">Products</a> &gt; `);
        $breadcrumb.append(`<a href="ProductListingPage.html?category=${encodeURIComponent(product.category)}">${product.category}</a> &gt; `);
        $breadcrumb.append(`<span class="breadcrumb-current">${product.name}</span>`);
    }

    function displayProduct(product) {
        $('#product-img').attr('src', product.image);
        $('#product-title').text(product.name);
        $('#product-description').text(product.description);
        $('#product-price').text(product.price);
        $('#product-sku').text(product.sku);
        $('#product-availability').text(product.availability);
    }

    function renderRelatedProducts(allProducts, product) {
        const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
        const $relatedContainer = $('#related-products');
        $relatedContainer.empty();

        related.forEach(p => {
            const $card = $(`
                <div class="product-card">
                    <img src="${p.image}" alt="${p.name}">
                    <h4>${p.name}</h4>
                    <p>$${p.price}</p>
                </div>
            `);
            $card.on('click', function () {
                window.location.href = `ProductDetailsPage.html?id=${encodeURIComponent(p.id)}`;
            });
            $relatedContainer.append($card);
        });
    }

    function setupAddToCart() {
        $('#add-to-cart').on('click', function () {
            const qty = parseInt($('#quantity').val()) || 1;
            alert(`Added ${qty} item(s) of "${$('#product-title').text()}" to cart!`);
        });
    }

    function loadReviews(id) {
        $.getJSON('data/reviews.json')
            .done(function (reviewsData) {
                const productReviewEntry = reviewsData.find(r => r.product_id == id);
                const $reviewsContainer = $('#reviews-container');
                $reviewsContainer.empty();

                if (!productReviewEntry || !productReviewEntry.reviews.length) {
                    $reviewsContainer.html('<p>No reviews yet.</p>');
                    return;
                }

                productReviewEntry.reviews.forEach(r => {
                    const $card = $(`
                        <div class="review-card">
                            <strong>${r.user}</strong> - <em>${r.title}</em>
                            <p>Rating: ${r.rating}/5</p>
                            <p>${r.comment}</p>
                        </div>
                    `);
                    $reviewsContainer.append($card);
                });
            })
            .fail(function () {
                $('#reviews-container').html('<p style="color:red;">Failed to load reviews.</p>');
            });
    }
});
