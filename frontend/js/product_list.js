// ============================================
// PRODUCT LIST PAGE - FIXED VERSION
// ============================================

/**
 * STEP 1: GET CATEGORY FILTER FROM URL
 * When user clicks "Electronics" in categories page
 * URL becomes: product_list.html?id=1&name=Electronics
 * We extract both id and name
 */
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");      // Gets category ID if present
const categoryName = params.get("name");  // Gets category NAME if present

/**
 * STEP 2: DETERMINE API URL
 * If category selected → filter by category
 * If no category → show all products
 */
let apiUrl = "http://localhost:8080/api/products";

// Check if user selected a specific category
if (categoryName) {
    // Update page title to show category name
    document.getElementById("page-title").innerText = categoryName + " Products";
    
    // FIX: Use categoryName instead of categoryId in API call
    // The backend API expects: /api/products/category/{categoryName}
    // Example: /api/products/category/Electronics
    apiUrl = `http://localhost:8080/api/products/category/${categoryName}`;
    
    console.log("Loading products for category:", categoryName);
}

/**
 * STEP 3: FETCH PRODUCTS FROM BACKEND API
 * Makes HTTP request to backend REST API
 */
function loadProducts() {
    // Show loading state
    const container = document.getElementById("product_list");
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading products...</p>
        </div>
    `;

    // Fetch from API
    fetch(apiUrl)
        .then(response => {
            // Check if response is OK (status 200)
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            // SUCCESS - Render products
            console.log("Loaded products:", products);
            renderProducts(products);
        })
        .catch(error => {
            // ERROR - Show error message
            console.error("Error fetching products:", error);
            const container = document.getElementById("product_list");
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle"></i> 
                        <strong>Error loading products!</strong><br>
                        ${error.message}
                        <br><br>
                        <small>Make sure your backend server is running on http://localhost:8080</small>
                    </div>
                </div>
            `;
        });
}

/**
 * STEP 4: RENDER PRODUCTS ON PAGE
 * Creates HTML cards for each product
 * @param {array} products - Array of product objects from API
 */
function renderProducts(products) {
    const container = document.getElementById("product_list");

    // Check if any products found
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-inbox" style="font-size: 60px; color: #ccc;"></i>
                <h4 class="mt-3">No products found</h4>
                <p class="text-muted">Try selecting a different category</p>
                <a href="../../pages/static/categories.html" class="btn btn-primary mt-3">
                    Browse Categories
                </a>
            </div>
        `;
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Create card for each product
    products.forEach(product => {
        // Calculate star rating display (can be dynamic from DB later)
        const rating = product.rating || 4.5;
        const stars = Array(5).fill('<i class="fas fa-star"></i>').join('');

        const productCard = `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card h-100 shadow-sm hover-shadow" 
                     style="transition: transform 0.3s, box-shadow 0.3s;">
                    
                    <!-- Product Image -->
                    <div style="height: 200px; overflow: hidden; background: #f5f5f5;">
                        <img 
                            src="${product.imageUrl || '/assets/images/iphone'}" 
                            alt="${product.name}"
                            class="card-img-top"
                            style="height: 100%; object-fit: contain; padding: 10px;"
                        >
                    </div>

                    <!-- Product Info -->
                    <div class="card-body">
                        <!-- Product Name (limit to 2 lines) -->
                        <h6 class="card-title mb-2" style="min-height: 45px;">
                            ${product.name}
                        </h6>

                        <!-- Category (optional) -->
                        <p class="text-muted small mb-2">
                            ${product.category?.name || 'Uncategorized'}
                        </p>

                        <!-- Price -->
                        <p class="text-primary fw-bold mb-2" style="font-size: 1.2rem;">
                            ₹${product.price.toLocaleString('en-IN')}
                        </p>

                        <!-- Rating -->
                        <div class="text-warning small mb-3">
                            <span class="text-warning">★★★★☆</span>
                            <span class="text-muted">(${rating})</span>
                        </div>

                        <!-- Stock Status -->
                        <p class="mb-3">
                            <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                                ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </p>

                        <!-- Buttons -->
                        <div class="d-grid gap-2">
                            <!-- View Details Button -->
                            <a 
                                href="product_details.html?id=${product.id}" 
                                class="btn btn-primary btn-sm"
                            >
                                <i class="fas fa-eye"></i> View Details
                            </a>

                            <!-- Add to Cart Button -->
                            <button 
                                class="btn btn-outline-secondary btn-sm"
                                onclick="addQuickCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.imageUrl || '/assets/images/placeholder.jpg'}')"
                                ${product.stock === 0 ? 'disabled' : ''}
                            >
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML += productCard;
    });
}

/**
 * STEP 5: QUICK ADD TO CART
 * When user clicks "Add to Cart" from product list
 * Adds 1 item to cart without going to details page
 */
function addQuickCart(productId, productName, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already exists
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            image: image,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Show notification
    showNotification(`${productName} added to cart!`, 'success');

    // Update cart badge
    updateCartBadge();
}

/**
 * STEP 6: SHOW NOTIFICATION
 * Displays popup notification to user
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideIn 0.3s ease;
    `;

    notification.innerHTML = `
        <strong>${message}</strong>
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

/**
 * STEP 7: UPDATE CART BADGE
 * Shows number of items in cart on navbar
 */
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = 0;
    cart.forEach(item => {
        count += item.quantity;
    });

    // Update navbar cart icon (if exists)
    const cartIcon = document.querySelector('[data-cart-count]');
    if (cartIcon) {
        if (count > 0) {
            cartIcon.textContent = count;
            cartIcon.style.display = 'inline';
        } else {
            cartIcon.style.display = 'none';
        }
    }
}

/**
 * STEP 8: LOAD PRODUCTS ON PAGE LOAD
 * Called automatically when page opens
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log("Product list page loaded");
    loadProducts();
    updateCartBadge();
});