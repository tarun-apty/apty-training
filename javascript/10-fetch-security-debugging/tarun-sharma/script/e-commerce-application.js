async function fetchProducts() {
    try {

        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
        
    } catch (error) {

        throw new Error('Error fetching products: ' + error.message);
    }

}

async function searchProducts() {

    const query = document.getElementById('searchInput').value.trim();
    if (!query) {

        loadProducts();

        return;
    }

    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    loadingDiv.style.display = 'block';

    errorDiv.style.display = 'none';

    try {

        const response = await fetch(`https://dummyjson.com/products/search?q=${(query)}`);

        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        displayProducts(data.products);

    } catch (error) {

        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {

        loadingDiv.style.display = 'none';
    }
}

async function getProduct(id) {

    try {

        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product details');
        return await response.json();
    } catch (error) {

        throw new Error('Error fetching product details: ' + error.message);
    }
}

function displayProducts(products) {

    const grid = document.getElementById('productsGrid');
    grid.style.display = 'grid';

    document.getElementById('productDetail').style.display = 'none';

    if(products.length <=0){
        grid.innerHTML = `
        <div class="product-card">
           No products found
        </div>
    `;
        return;
    }

    grid.innerHTML = products.map(product => `

        <div class="product-card">
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description.substring(0, 100)}...</p>
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Rating:</strong> ${product.rating}/5</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <button class="view-details" onclick="viewProduct(${product.id})">View Details</button>
        </div>
    `).join('');

}

async function viewProduct(id) {

    const loadingDiv = document.getElementById('loading');

    const errorDiv = document.getElementById('error');

    const detailDiv = document.getElementById('productDetail');
    const gridDiv = document.getElementById('productsGrid');

    loadingDiv.style.display = 'block';

    errorDiv.style.display = 'none';

    try {
        const product = await getProduct(id);

        detailDiv.innerHTML = `

            <button class="back-button" onclick="backToList()">← Back to Products</button>
            <h2>${product.title}</h2>

            <img src="${product.thumbnail}" alt="${product.title}">

            <div style="margin-top: 20px;">
                <p>${product.description}</p>

                <p><strong>Price:</strong> $${product.price}</p>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Category:</strong> ${product.category}</p>

                <p><strong>Rating:</strong> ${product.rating}/5</p>
                <p><strong>Stock:</strong> ${product.stock}</p>

                <p><strong>Discount:</strong> ${product.discountPercentage}%</p>
            </div>
        `;


        gridDiv.style.display = 'none';

        detailDiv.style.display = 'block';

    } catch (error) {

        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {

        loadingDiv.style.display = 'none';

    }

}

function backToList() {

    document.getElementById('productDetail').style.display = 'none';

    document.getElementById('productsGrid').style.display = 'grid';

}

async function loadProducts() {

    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    loadingDiv.style.display = 'block';

    errorDiv.style.display = 'none';

    try {

        const data = await fetchProducts();
        displayProducts(data.products);

    } catch (error) {
        errorDiv.textContent = error.message;

        errorDiv.style.display = 'block';

    } finally {
        loadingDiv.style.display = 'none';
    }

}


loadProducts();