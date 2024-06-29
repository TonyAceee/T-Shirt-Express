
document.addEventListener('DOMContentLoaded', function () {
    
    const categoryNavItems = document.querySelectorAll('.category-nav li');
    const categoryContents = document.querySelectorAll('.category-content');

    categoryNavItems.forEach(item => {
        item.addEventListener('click', function () {
            const category = this.getAttribute('category');
            const content = document.getElementById(category);

            if (content.classList.contains('open')) {
                content.classList.remove('open');
            } else {
                categoryContents.forEach(content => content.classList.remove('open'));
                content.classList.add('open');
            }
        });
    });

   
    function openCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        const subcategory = params.get('subcategory');

        if (subcategory) {
            const targetCategoryLink = document.querySelector(`.category-nav a[href*="${subcategory}"]`);
            if (targetCategoryLink) {
                const targetCategoryContent = targetCategoryLink.closest('.category-content');
                if (targetCategoryContent) {
                    categoryContents.forEach(content => content.classList.remove('open'));
                    targetCategoryContent.classList.add('open');
                }
            }
        }
    }

    openCategoryFromURL();

    const sizeFilter = document.getElementById('size');
    const colorFilter = document.getElementById('color');
    const priceFilter = document.getElementById('price');
    const sortFilter = document.getElementById('sort');

    
    async function fetchProducts() {
        const params = new URLSearchParams(window.location.search);

        if (sizeFilter) {
            params.set('size', sizeFilter.value);
        }
        if (colorFilter) {
            params.set('color', colorFilter.value);
        }
        if (priceFilter) {
            params.set('price', priceFilter.value);
        }
        if (sortFilter) {
            params.set('sort', sortFilter.value);
        }

        const category = window.location.pathname.split('/')[2];
        const url = `/api/category/${category}`;

        try {
            const response = await fetch(`${url}?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const products = await response.json();

            const productsContainer = document.getElementById('products-container');
            productsContainer.innerHTML = '';

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.dataset.size = product.size;
                productDiv.dataset.color = product.color;
                productDiv.dataset.price = product.price;

                productDiv.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <p>${product.name}</p>
                <p class="price">${product.price} zl</p>
                <form class="add-to-cart-form" method="POST" action="/cart/add">
                    <input type="hidden" name="productId" value="${product._id}">
                    <label for="size-${product._id}">Size:</label>
                    <select name="size" id="size-${product._id}">
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                    <button type="submit">Add to Cart</button>
                </form>
            `;

                productsContainer.appendChild(productDiv);
            });

            
            attachCartFormHandlers();

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    
    function attachCartFormHandlers() {
        const addToCartForms = document.querySelectorAll('.add-to-cart-form');

        addToCartForms.forEach(form => {
            form.addEventListener('submit', async function (event) {
                event.preventDefault();

                const productId = this.querySelector('input[name="productId"]').value;
                const size = this.querySelector('select[name="size"]').value;

                try {
                    const response = await fetch('/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ productId, size, quantity: 1 })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to add product to cart');
                    }

                    const result = await response.json();
                    console.log('Product added to cart:', result);

                    
                    alert('Product added to cart successfully');

                } catch (error) {
                    console.error('Error adding product to cart:', error);
                    alert('Error adding product to cart');
                }
            });
        });
    }

    
    if (sizeFilter) sizeFilter.addEventListener('change', fetchProducts);
    if (colorFilter) colorFilter.addEventListener('change', fetchProducts);
    if (priceFilter) priceFilter.addEventListener('change', fetchProducts);
    if (sortFilter) sortFilter.addEventListener('change', fetchProducts);

    
    fetchProducts();
});