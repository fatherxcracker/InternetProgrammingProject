$(document).ready(function () {
    initHeroSlider();
    loadCategories();
    loadProductCarousel();
    autoScrollProductCarousel();

<<<<<<< Updated upstream
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = $(this).attr('href');
        var headerHeight = $('header').outerHeight(); 
        $('html, body').animate({
            scrollTop: $(target).offset().top - headerHeight
        }, 600);
=======
    let slides = $('.hero-slider .slide');
    let currentIndex = 0;

    function showNextSlide() {
        slides.eq(currentIndex).removeClass('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides.eq(currentIndex).addClass('active');
    }

    setInterval(showNextSlide, 3000);

    $.ajax({
    url: 'data/categories.xml',
    dataType: 'xml',
    success: function(xml) {
        $(xml).find('category').each(function() {
            const name = $(this).text().trim();
            const $link = $('<a>')
                .attr('href', `ProductListingPage.html?category=${encodeURIComponent(name)}`)
                .addClass('category-link');

            const $div = $('<div>').text(name).addClass('category-bubble');
            $link.append($div);

            $('#category-list').append($link);
        });
    }


});

    $(".icon-account").click(function () {
        window.location.href = "profile.html";
    });

    $(".icon-cart").click(function () {
        window.location.href = "shoppingCart.html";
    });


    $.getJSON('data/products.json', function(data) {
        data.forEach(prod => {
            $('#product-carousel').append(`
                <div class="product">
                    <img src="${prod.image}" alt="${prod.name}" style="width:100%; border-radius: 8px;">
                    <h4>${prod.name}</h4>
                    <p>$${prod.price}</p>
                </div>
            `);
        });
    }).fail(function() {
        console.error("Failed to load featured products JSON.");
>>>>>>> Stashed changes
    });


    function initHeroSlider() {
        var slides = $('.hero-slider .slide');
        var currentIndex = 0;
        function showNextSlide() {
            slides.eq(currentIndex).removeClass('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides.eq(currentIndex).addClass('active');
        }
        setInterval(showNextSlide, 3000);
    }

    function loadCategories() {
        $.ajax({
            url: 'data/categories.xml',
            dataType: 'xml',
            success: function (xml) {
                $(xml).find('category').each(function () {
                    const name = $(this).text().trim();
                    const $link = $('<a>')
                        .attr('href', `ProductListingPage.html?category=${encodeURIComponent(name)}`)
                        .addClass('category-link');
                    const $bubble = $('<div>').addClass('category-bubble').text(name);
                    $link.append($bubble);
                    $('#category-list').append($link);
                });
            },
        });
    }

    function loadProductCarousel() {
        $.getJSON('data/products.json', function (data) {
            data.forEach(product => {
                $('#product-carousel').append(`
                    <a href="ProductDetailsPage.html?id=${product.id}" class="product-link">
                        <div class="product">
                            <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius: 8px;">
                            <h4>${product.name}</h4>
                            <p>$${product.price}</p>
                        </div>
                    </a>
                `);
            });
        });
    }

    function autoScrollProductCarousel() {
        const $carousel = $('#product-carousel');
        let scrollAmount = 0;

        function scrollStep() {
            scrollAmount += 1; 
            if (scrollAmount >= $carousel[0].scrollWidth - $carousel.width()) {
                scrollAmount = 0; 
            }
            $carousel.scrollLeft(scrollAmount);
        }

        setInterval(scrollStep, 50); 
    }
});

