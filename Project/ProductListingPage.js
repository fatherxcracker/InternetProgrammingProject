$(document).ready(function () {
    var products = [];
    var filteredProducts = [];
    var currentPage = 1;
    const productsPerPage = 12;

    const $productGrid = $('#product-grid');
    const $categorySelect = $('#category-select');
    const $priceRange = $('#price-range');
    const $priceValue = $('#price-value');
    const $sortSelect = $('#sort-select');
    const $pagination = $('#pagination');

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = (urlParams.get('category') || 'Electronics').trim();

    $.ajax({
        url: 'data/categories.xml',
        dataType: 'xml',
        success: function (xml) {
            $(xml).find('category').each(function () {
                const name = $(this).text().trim(); 
                const $option = $('<option>').val(name).text(name);
                if (name === selectedCategory) {
                    $option.prop('selected', true);
                }
                $categorySelect.append($option);
            });

            loadProducts(selectedCategory);
        }
    });

    function loadProducts(category) {
        const fileName = category.trim();
        $.getJSON(`data/${fileName}.json`, function (data) {
            products = data;
            filteredProducts = [...products];
            currentPage = 1;
            renderProducts();
            renderPagination();
        }).fail(function () {
            console.error(`Failed to load ${fileName}.json`);
            $productGrid.html('<p style="color:red;">Products not found for this category.</p>');
        });
    }

    function renderProducts() {
        $productGrid.empty();
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const pageProducts = filteredProducts.slice(start, end);

        pageProducts.forEach(product => {
            const $card = $(`
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h4>${product.name}</h4>
                    <p>$${product.price}</p>
                </div>
            `);
            $productGrid.append($card);
        });
    }

    $categorySelect.on('change', function () {
        const newCategory = $(this).val().trim();
        window.location.href = `ProductListingPage.html?category=${encodeURIComponent(newCategory)}`;
    });

    $priceRange.on('input', function () {
        const maxPrice = $(this).val();
        $priceValue.text(maxPrice);
        filteredProducts = products.filter(p => p.price <= maxPrice);
        currentPage = 1;
        renderProducts();
        renderPagination();
    });

    $sortSelect.on('change', function () {
        const sortValue = $(this).val();
        if (sortValue === 'low-high') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
        currentPage = 1;
        renderProducts();
        renderPagination();
    });

    function renderPagination() {
        $pagination.empty();
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const $btn = $('<button>').text(i);
            if (i === currentPage) $btn.addClass('active');
            $btn.on('click', function () {
                currentPage = i;
                renderProducts();
                renderPagination();
            });
            $pagination.append($btn);
        }
    }
});
