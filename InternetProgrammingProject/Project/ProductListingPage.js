$(document).ready(function () {
    var products = [];
    var filteredProducts = [];
    var currentPage = 1;
    const productsPerPage = 14;

    const $productGrid = $('#product-grid');
    const $categorySelect = $('#category-select');
    const $priceRange = $('#price-range');
    const $priceValue = $('#price-value');
    const $sortSelect = $('#sort-select');
    const $pagination = $('#pagination');

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = (urlParams.get('category') || 'Electronics').trim();

    $.getJSON('data/products.json', function (data) {
        products = data;
        filteredProducts = filterByCategory(products, selectedCategory);

        sortProducts('alpha');

        renderProducts();
        renderPagination();
        populateCategories(selectedCategory);
        renderBreadcrumb(selectedCategory);
    });

    $categorySelect.on('change', function () {
        const newCategory = $(this).val().trim();
        window.location.href = `ProductListingPage.html?category=${encodeURIComponent(newCategory)}`;
    });

    $priceRange.on('input', function () {
        const maxPrice = parseFloat($(this).val());
        $priceValue.text(maxPrice);
        filteredProducts = filterByCategory(products, selectedCategory)
            .filter(p => p.price <= maxPrice);

        sortProducts($sortSelect.val());

        currentPage = 1;
        renderProducts();
        renderPagination();
    });

    $sortSelect.on('change', function () {
        sortProducts($(this).val());
        currentPage = 1;
        renderProducts();
        renderPagination();
    });

    function filterByCategory(products, category) {
        return products.filter(p => p.category === category);
    }

    function sortProducts(criteria) {
        if (criteria === 'low-high') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (criteria === 'high-low') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    function renderProducts() {
        $productGrid.empty();
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const pageProducts = filteredProducts.slice(start, end);

        pageProducts.forEach(product => {
            const $card = createProductCard(product);
            $productGrid.append($card);
        });
    }

    function createProductCard(product) {
        const $card = $(`
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
            </div>
        `);

        $card.on('click', function () {
            window.location.href = `ProductDetailsPage.html?id=${encodeURIComponent(product.id)}`;
        });

        return $card;
    }

    function renderPagination() {
        $pagination.empty();
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (totalPages <= 1) return;

        appendPaginationButton('Prev', currentPage > 1, () => changePage(currentPage - 1));

        for (let i = 1; i <= totalPages; i++) {
            appendPaginationButton(i, true, () => changePage(i), i === currentPage);
        }

        appendPaginationButton('Next', currentPage < totalPages, () => changePage(currentPage + 1));
    }

    function appendPaginationButton(text, enabled, onClick, isActive = false) {
        const $btn = $('<button>')
            .text(text)
            .prop('disabled', !enabled);

        if (isActive) $btn.addClass('active');

        $btn.on('click', onClick);
        $pagination.append($btn);
    }

    function changePage(page) {
        currentPage = page;
        renderProducts();
        renderPagination();
        window.scrollTo(0, 0);
    }

    function populateCategories(selected) {
        const categories = [...new Set(products.map(p => p.category))];
        categories.forEach(cat => {
            const $option = $('<option>').val(cat).text(cat);
            if (cat === selected) $option.prop('selected', true);
            $categorySelect.append($option);
        });
    }

    function renderBreadcrumb(category) {
        const $breadcrumb = $('#breadcrumb');
        $breadcrumb.empty();
        $breadcrumb.append(`<a href="HomePage.html">Home</a> &gt; `);
        $breadcrumb.append(`<a href="ProductListingPage.html">Products</a> &gt; `);
        $breadcrumb.append(`<span class="breadcrumb-current">${category}</span>`);
    }
});
