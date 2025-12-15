$(document).ready(function () {
    loadFooterCategories();
    setupSearch();

    function loadFooterCategories() {
        $.ajax({
            url: 'data/categories.xml',
            dataType: 'xml',
            success: function (xml) {
                const $footerList = $('#footer-category-list');
                if ($footerList.children().length > 0) return;

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
        const $suggestions = $('<div class="search-suggestions"></div>');
        $('.search-container').append($suggestions);

        var allProducts = [];
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
});
