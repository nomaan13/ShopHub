// ============================================
// CART.JS - SHOPPING CART MANAGEMENT SYSTEM
// ============================================

/**
 * ADD ITEM TO CART
 * Call this function when user clicks "Add to Cart" button
 * @param {number} productId - Product ID
 * @param {string} name - Product Name
 * @param {number} price - Product Price
 * @param {string} image - Product Image URL (optional)
 */
function addToCart(productId, name, price, image = null) {
    
    // Get existing cart from browser storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // If exists, increase quantity
        existingItem.quantity += 1;
        showNotification('Quantity updated!', 'success');
    } else {
        // If new, add to cart
        const newItem = {
            id: productId,
            name: name,
            price: price,
            image: image || '/assets/images/placeholder.jpg',
            quantity: 1
        };
        cart.push(newItem);
        showNotification('Added to cart!', 'success');
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart icon/badge count
    updateCartBadge();
}

/**
 * REMOVE ITEM FROM CART
 * @param {number} productId - Product ID to remove
 */
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Filter out the item with matching ID
    cart = cart.filter(item => item.id !== productId);
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    showNotification('Item removed!', 'info');
    updateCartBadge();
    
    // Refresh cart display if on cart page
    if (typeof displayCart === 'function') {
        displayCart();
    }
}

/**
 * CLEAR ENTIRE CART
 */
function clearCart() {
    if (confirm('Are you sure you want to clear the entire cart?')) {
        localStorage.removeItem('cart');
        showNotification('Cart cleared!', 'info');
        updateCartBadge();
        
        if (typeof displayCart === 'function') {
            displayCart();
        }
    }
}

/**
 * GET CART TOTAL
 * Returns total price of all items in cart
 * @returns {number} Total cart value
 */
function getCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    
    return total;
}

/**
 * GET CART ITEM COUNT
 * Returns total number of items in cart
 * @returns {number} Total item count
 */
function getCartItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = 0;
    
    cart.forEach(item => {
        count += item.quantity;
    });
    
    return count;
}

/**
 * UPDATE CART BADGE
 * Updates the cart icon with item count
 * Shows badge with number of items
 */
function updateCartBadge() {
    const count = getCartItemCount();
    const cartIcon = document.querySelector('.cart-badge');
    
    if (cartIcon) {
        if (count > 0) {
            cartIcon.innerHTML = `
                <i class="fas fa-shopping-cart"></i>
                <span class="badge bg-danger" style="position: absolute; top: -5px; right: -5px;">
                    ${count}
                </span>
            `;
        } else {
            cartIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
        }
    }
}

/**
 * SHOW NOTIFICATION
 * Displays a temporary notification to user
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    // Create notification div
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
        <div style="display: flex; align-items: center; gap: 10px;">
            ${getIconForType(type)}
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * GET ICON FOR NOTIFICATION TYPE
 * @param {string} type - Notification type
 * @returns {string} HTML icon
 */
function getIconForType(type) {
    const icons = {
        'success': '<i class="fas fa-check-circle" style="color: green;"></i>',
        'error': '<i class="fas fa-times-circle" style="color: red;"></i>',
        'info': '<i class="fas fa-info-circle" style="color: blue;"></i>',
        'warning': '<i class="fas fa-exclamation-circle" style="color: orange;"></i>'
    };
    return icons[type] || icons['info'];
}

/**
 * GET CART DATA
 * Returns entire cart data
 * @returns {array} Cart array
 */
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

/**
 * UPDATE CART ITEM QUANTITY
 * @param {number} productId - Product ID
 * @param {number} quantity - New quantity
 */
function updateCartQuantity(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
        }
    }
}

// ============================================
// ADD ANIMATION STYLES
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE CART BADGE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
});