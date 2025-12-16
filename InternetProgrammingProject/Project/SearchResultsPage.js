$(document).ready(function () {
    const $resultsGrid = $('#search-results');
    const $keywordSpan = $('#search-keyword');
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('q') ? urlParams.get('q').trim() : '';
    const resultsPerPage = 49; 
    var currentPage = 1;
    var matches = [];

    $keywordSpan.text(keyword);

    if (!keyword) {
        showMessage($resultsGrid, 'No search keyword provided.');
        return;
    }

    loadProducts();
    renderBreadcrumb();

    function loadProducts() {
        $.getJSON('data/products.json')
            .done(function(allProducts) {
                matches = filterProducts(allProducts, keyword);

                matches.sort((a, b) => a.name.localeCompare(b.name));

                if (matches.length === 0) {
                    showMessage($resultsGrid, 'No products found.');
                    return;
                }

                renderPage(currentPage);
                renderPagination();
            })
            .fail(function() {
                showMessage($resultsGrid, 'Failed to load products.');
            });
    }

    function filterProducts(products, keyword) {
        return products.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
    }

    function renderPage(page) {
        $resultsGrid.empty();
        const pageProducts = paginate(matches, page, resultsPerPage);

        pageProducts.forEach(product => {
            const $card = createProductCard(product);
            $resultsGrid.append($card);
        });
    }

    function paginate(items, page, perPage) {
        const start = (page - 1) * perPage;
        return items.slice(start, start + perPage);
    }

    function createProductCard(product) {
        const regex = new RegExp(`(${keyword})`, 'gi');
        const highlightedName = product.name.replace(regex, '<mark>$1</mark>');

        const $card = $(`
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h4>${highlightedName}</h4>
                <p>$${product.price}</p>
            </div>
        `);

        $card.on('click', function () {
            goToProductDetails(product.id);
        });

        return $card;
    }

    function goToProductDetails(productId) {
        window.location.href = `ProductDetailsPage.html?id=${encodeURIComponent(productId)}`;
    }

    function renderPagination() {
        const totalPages = Math.ceil(matches.length / resultsPerPage);
        if (totalPages <= 1) return;

        var $pagination = $('#pagination');
        if ($pagination.length === 0) {
            $pagination = $('<div id="pagination" class="pagination"></div>');
            $resultsGrid.after($pagination);
        }
        $pagination.empty();

        appendPaginationButton($pagination, 'Prev', currentPage > 1, () => changePage(currentPage - 1));

        for (let i = 1; i <= totalPages; i++) {
            appendPaginationButton($pagination, i, true, () => changePage(i), i === currentPage);
        }

        appendPaginationButton($pagination, 'Next', currentPage < totalPages, () => changePage(currentPage + 1));
    }

    function appendPaginationButton($container, text, enabled, onClick, isActive = false) {
        const $btn = $('<button>').text(text).prop('disabled', !enabled);
        if (isActive) $btn.addClass('active');
        $btn.on('click', () => {
            onClick();
        });
        $container.append($btn);
    }

    function changePage(page) {
        currentPage = page;
        renderPage(currentPage);
        renderPagination();
        window.scrollTo(0, 0);
    }

    function showMessage($container, message) {
        $container.html(`<p style="color:red;">${message}</p>`);
    }

    function renderBreadcrumb() {
        const $breadcrumb = $('#breadcrumb');
        $breadcrumb.empty();
        $breadcrumb.append(`<a href="HomePage.html">Home</a> &gt; `);
        $breadcrumb.append(`<span class="breadcrumb-current">Search Results</span>`);
    }

});
