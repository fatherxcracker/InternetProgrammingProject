$(document).ready(function() {

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
    });

});
