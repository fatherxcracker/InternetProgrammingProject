$(document).ready(function () {
    loadFooterCategories();
    setupSearch();
    bindHeaderClicks();
    updateCartBadge();

    $(document).on('cartUpdated', updateCartBadge);

    function loadFooterCategories() {
        $.ajax({
            url: 'data/categories.xml',
            dataType: 'xml',
            success: function (xml) {
                const $footerList = $('#footer-category-list');
                if ($footerList.length === 0 || $footerList.children().length > 0) return;

                $(xml).find('category').each(function () {
                    const name = $(this).text().trim();
                    const $li = $('<li>');
                    const $a = $('<a>')
                        .attr('href', `ProductListingPage.html?category=${encodeURIComponent(name)}`)
                        .text(name);
                    $li.append($a);
                    $footerList.append($li);
                });
            }
        });
    }

    function setupSearch() {
        const $searchInput = $('.search-container input');
        if ($searchInput.length === 0) return;

        const $suggestions = $('<div class="search-suggestions"></div>');
        $('.search-container').append($suggestions);

        let allProducts = [];
        $.getJSON('data/products.json', function (data) {
            allProducts = data;
        });

        $searchInput.on('input', function () {
            const query = $(this).val().trim().toLowerCase();
            $suggestions.empty();

            if (!query) {
                $suggestions.hide();
                return;
            }

            const matches = allProducts.filter(p => p.name.toLowerCase().includes(query));
            matches.forEach(p => $suggestions.append(createSuggestionItem(p, query)));

            $suggestions.show();
        });

        $searchInput.on('keypress', function (e) {
            if (e.which === 13) {
                const query = $(this).val().trim();
                if (query) {
                    window.location.href = `SearchResultsPage.html?q=${encodeURIComponent(query)}`;
                }
            }
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.search-container').length) {
                $suggestions.hide();
            }
        });
    }

    function createSuggestionItem(product, query) {
        const $item = $('<div></div>').html(highlight(product.name, query));
        $item.on('click', function () {
            window.location.href = `SearchResultsPage.html?q=${encodeURIComponent(product.name)}`;
        });
        return $item;
    }

    function highlight(text, keyword) {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function bindHeaderClicks() {
        $(document).on('click', '.icon-cart', function () {
            window.location.href = 'shoppingCart.html';
        });

        $(document).on('click', '.icon-account', function () {
            const token = getCookie('token');
            if (!token) {
                window.location.href = 'login.html';
            } else {
                window.location.href = 'profile.html';
            }
        });
    }

    function updateCartBadge() {
        const $badge = $('.icon-cart .badge');
        if ($badge.length === 0) return;

        const token = getCookie('token');
        if (!token) {
            $badge.text(0);
            return;
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        $badge.text(totalQty);
    }

    $(document).on('click', '#logoutBtn', function () {
        deleteCookie('token');
        deleteCookie('username');
        deleteCookie('email');
        $('.icon-cart .badge').text(0);
        localStorage.removeItem('cart');
        window.location.href = 'login.html';
    });

    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=0; path=/';
    }
});
