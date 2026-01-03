// // ============================================
// // PRODUCT DETAILS PAGE - FIXED VERSION
// // ============================================

// /**
//  * STEP 1: GET PRODUCT ID FROM URL
//  * When user visits product_details.html?id=5
//  * This reads the id parameter
//  */
// const params = new URLSearchParams(window.location.search);
// const productId = params.get("id");

// // Check if product ID exists
// if (!productId) {
//     document.getElementById("product-details").innerHTML =
//         `<div class="alert alert-danger">
//             <i class="fas fa-exclamation-circle"></i> Invalid product ID
//         </div>`;
//     throw new Error("Product ID missing in URL");
// }

// /**
//  * STEP 2: FETCH PRODUCT FROM BACKEND API
//  * Calls: http://localhost:8080/api/products/{id}
//  */
// function loadProductDetails() {
//     // Show loading state
//     document.getElementById("product-details").innerHTML = `
//         <div class="text-center py-5">
//             <div class="spinner-border text-primary" role="status">
//                 <span class="visually-hidden">Loading...</span>
//             </div>
//             <p class="mt-3">Loading product details...</p>
//         </div>
//     `;

//     // Fetch from API
//     fetch(`http://localhost:8080/api/products/${productId}`)
//         .then(response => {
//             // Check if response is OK
//             if (!response.ok) {
//                 throw new Error(`Product not found (Status: ${response.status})`);
//             }
//             return response.json();
//         })
//         .then(product => {
//             // SUCCESS - Render the product
//             renderProduct(product);
//         })
//         .catch(error => {
//             // ERROR - Show error message
//             console.error("Error:", error);
//             document.getElementById("product-details").innerHTML = `
//                 <div class="alert alert-danger">
//                     <i class="fas fa-exclamation-circle"></i> 
//                     Unable to load product: ${error.message}
//                 </div>
//             `;
//         });
// }

// /**
//  * STEP 3: RENDER PRODUCT ON PAGE
//  * Creates HTML with all product information
//  * @param {object} product - Product object from API
//  */
// function renderProduct(product) {
//     // Get the container
//     const container = document.getElementById("product-details");

//     // Create HTML with product data
//     const html = `
//         <!-- LEFT SIDE - PRODUCT IMAGE -->
//         <div class="col-md-5">
//             <div class="product-image-box">
//                 <img 
//                     src="${product.imageUrl || '/assets/images/placeholder.jpg'}"
//                     alt="${product.name}"
//                     class="img-fluid"
//                     id="mainImage"
//                 >
//             </div>
//         </div>

//         <!-- RIGHT SIDE - PRODUCT DETAILS -->
//         <div class="col-md-7">
//             <!-- Product Name -->
//             <h2 class="mb-3" id="product-name">
//                 ${product.name}
//             </h2>

//             <!-- Rating -->
//             <div class="mb-3">
//                 <span class="text-warning">
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star"></i>
//                     <i class="fas fa-star-half-alt"></i>
//                     (4.5 out of 5)
//                 </span>
//             </div>

//             <!-- Price -->
//             <h3 class="text-primary fw-bold mb-3">
//                 ₹${product.price.toLocaleString('en-IN')}
//             </h3>

//             <!-- Stock Status -->
//             <p class="mb-3">
//                 <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
//                     ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
//                 </span>
//                 <span class="text-muted ms-2">(${product.stock} available)</span>
//             </p>

//             <!-- Category -->
//             <p class="text-muted mb-3">
//                 <strong>Category:</strong> 
//                 ${product.category?.name || 'Uncategorized'}
//             </p>

//             <!-- Description -->
//             <p class="lead mb-4">
//                 ${product.description || 'No description available'}
//             </p>

//             <!-- Features (Optional) -->
//             <div class="mb-4">
//                 <h5>Features</h5>
//                 <ul class="list-unstyled">
//                     <li><i class="fas fa-check text-success"></i> High Quality</li>
//                     <li><i class="fas fa-check text-success"></i> Original Product</li>
//                     <li><i class="fas fa-check text-success"></i> 1 Year Warranty</li>
//                     <li><i class="fas fa-check text-success"></i> Free Delivery</li>
//                 </ul>
//             </div>

//             <!-- QUANTITY SELECTOR -->
//             <div class="mb-4">
//                 <label class="form-label"><strong>Quantity</strong></label>
//                 <div class="d-flex gap-2 align-items-center">
//                     <button class="btn btn-outline-secondary" id="decreaseBtn" onclick="decreaseQty()">
//                         <i class="fas fa-minus"></i>
//                     </button>
//                     <input 
//                         type="number" 
//                         id="quantityInput" 
//                         value="1" 
//                         min="1" 
//                         max="${product.stock}"
//                         class="form-control" 
//                         style="width: 70px; text-align: center;"
//                         readonly
//                     >
//                     <button class="btn btn-outline-secondary" id="increaseBtn" onclick="increaseQty(${product.stock})">
//                         <i class="fas fa-plus"></i>
//                     </button>
//                 </div>
//             </div>

//             <!-- ACTION BUTTONS -->
//             <div class="d-flex gap-3 mb-4">
//                 <!-- Add to Cart Button -->
//                 <button 
//                     class="btn btn-primary btn-lg flex-grow-1" 
//                     id="addToCartBtn"
//                     onclick="addProductToCart(${product.id}, '${product.name}', ${product.price}, '${product.imageUrl || '/assets/images/placeholder.jpg'}')"
//                     ${product.stock === 0 ? 'disabled' : ''}
//                 >
//                     <i class="fas fa-shopping-cart"></i> Add to Cart
//                 </button>

//                 <!-- Add to Wishlist Button -->
//                 <button 
//                     class="btn btn-outline-secondary btn-lg"
//                     id="addToWishlistBtn"
//                     onclick="addToWishlist(${product.id}, '${product.name}')"
//                 >
//                     <i class="fas fa-heart"></i> Wishlist
//                 </button>
//             </div>

//             <!-- Additional Info -->
//             <div class="alert alert-info" role="alert">
//                 <i class="fas fa-truck"></i> <strong>Free Delivery</strong> on orders above ₹500
//                 <br>
//                 <i class="fas fa-undo"></i> <strong>Easy Returns</strong> within 7 days
//             </div>
//         </div>
//     `;

//     // Insert HTML into container
//     container.innerHTML = html;
// }

// /**
//  * STEP 4: ADD PRODUCT TO CART
//  * Calls the addToCart function from cart.js
//  */
// function addProductToCart(productId, name, price, image) {
//     const quantity = parseInt(document.getElementById('quantityInput').value);
    
//     // Get cart and add multiple times if quantity > 1
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
//     // Check if product exists
//     const existingItem = cart.find(item => item.id === productId);
    
//     if (existingItem) {
//         existingItem.quantity += quantity;
//     } else {
//         cart.push({
//             id: productId,
//             name: name,
//             price: price,
//             image: image,
//             quantity: quantity
//         });
//     }
    
//     localStorage.setItem('cart', JSON.stringify(cart));
    
//     // Show success message
//     showNotification(`Added ${quantity} item(s) to cart!`, 'success');
//     updateCartBadge();
// }

// /**
//  * STEP 5: INCREASE QUANTITY
//  */
// function increaseQty(maxStock) {
//     const input = document.getElementById('quantityInput');
//     let current = parseInt(input.value);
    
//     if (current < maxStock) {
//         input.value = current + 1;
//     } else {
//         showNotification('Maximum stock limit reached!', 'warning');
//     }
// }

// /**
//  * STEP 6: DECREASE QUANTITY
//  */
// function decreaseQty() {
//     const input = document.getElementById('quantityInput');
//     let current = parseInt(input.value);
    
//     if (current > 1) {
//         input.value = current - 1;
//     } else {
//         showNotification('Quantity cannot be less than 1!', 'warning');
//     }
// }

// /**
//  * STEP 7: ADD TO WISHLIST
//  */
// function addToWishlist(productId, productName) {
//     let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
//     // Check if already in wishlist
//     const exists = wishlist.find(item => item.id === productId);
    
//     if (exists) {
//         showNotification('Already in your wishlist!', 'info');
//         return;
//     }
    
//     wishlist.push({
//         id: productId,
//         name: productName,
//         addedDate: new Date().toISOString()
//     });
    
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//     showNotification('Added to wishlist!', 'success');
// }

// /**
//  * STEP 8: NOTIFICATION FUNCTION
//  * Shows popup messages to user
//  */
// function showNotification(message, type = 'info') {
//     const notification = document.createElement('div');
//     notification.className = `alert alert-${type}`;
//     notification.style.cssText = `
//         position: fixed;
//         top: 100px;
//         right: 20px;
//         z-index: 9999;
//         min-width: 300px;
//         box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//     `;
    
//     notification.innerHTML = `
//         <strong>${message}</strong>
//         <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
//     `;
    
//     document.body.appendChild(notification);
    
//     // Auto remove after 4 seconds
//     setTimeout(() => {
//         if (notification.parentElement) {
//             notification.remove();
//         }
//     }, 4000);
// }

// /**
//  * STEP 9: PAGE LOAD
//  * Call loadProductDetails when page loads
//  */
// document.addEventListener('DOMContentLoaded', function() {
//     loadProductDetails();
// });




// ============================================
// PRODUCT DETAILS PAGE
// ============================================

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    document.getElementById("product-details").innerHTML =
        `<div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i> Invalid product ID
        </div>`;
    throw new Error("Product ID missing in URL");
}

function loadProductDetails() {
    // Show loading state
    document.getElementById("product-details").innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Loading product details...</p>
        </div>
    `;

    // Use a relative API path (same origin). This will call the backend at /api/products/{id}.
    // If you run the API on a different host during development, you can temporarily
    // set the full URL, but prefer relative for production.
    fetch(`/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Product not found (Status: ${response.status})`);
            }
            return response.json();
        })
        .then(product => {
            renderProduct(product);
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("product-details").innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i> 
                    Unable to load product: ${error.message}
                </div>
            `;
        });
}

// Ensure you call loadProductDetails() at the end of the file or when DOM is ready:
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});