// admin_orders.js - Simplified for your database structure

// Global variables
let allOrders = [];

// Load orders when page loads
window.onload = function() {
    loadOrders();
}

function loadOrders() {
    showLoadingState();
    
    fetch("http://localhost:8080/admin/orders")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allOrders = data;
            renderOrders();
            updateStatistics(data);
        })
        .catch(error => {
            console.error("Error loading orders:", error);
            showErrorState("Failed to load orders. Please try again.");
        });
}

function renderOrders() {
    let tableBody = document.getElementById("ordersTableBody");
    
    if (allOrders.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No orders found</p>
                </td>
            </tr>
        `;
        updateOrderCount();
        return;
    }
    
    let html = '';
    allOrders.forEach(order => {
        // Get status class for styling
        const statusClass = getStatusClass(order.status);
        
        html += `
            <tr>
                <td><strong>#${order.orderId}</strong></td>
                <td>${order.userName || 'Unknown User'}</td>
                <td>
                    <span class="fw-bold">₹${formatCurrency(order.totalAmount)}</span>
                </td>
                <td>
                    <select class="status-select ${statusClass}" 
                            onchange="updateStatus(${order.orderId}, this.value)"
                            title="Click to change status">
                        <option value="PLACED" ${order.status === "PLACED" ? "selected" : ""}>PLACED</option>
                        <option value="SHIPPED" ${order.status === "SHIPPED" ? "selected" : ""}>SHIPPED</option>
                        <option value="DELIVERED" ${order.status === "DELIVERED" ? "selected" : ""}>DELIVERED</option>
                        <option value="CANCELLED" ${order.status === "CANCELLED" ? "selected" : ""}>CANCELLED</option>
                    </select>
                </td>
                <td>
                    <button class="btn-view" title="View Details" onclick="viewOrder(${order.orderId})">
                        <i class="fas fa-eye me-1"></i> View
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    updateOrderCount();
}

function updateStatistics(orders) {
    const placedCount = orders.filter(o => o.status === "PLACED").length;
    const shippedCount = orders.filter(o => o.status === "SHIPPED").length;
    const deliveredCount = orders.filter(o => o.status === "DELIVERED").length;
    const cancelledCount = orders.filter(o => o.status === "CANCELLED").length;
    
    // Update statistics cards
    document.getElementById('pendingOrders').textContent = placedCount;
    document.getElementById('shippedOrders').textContent = shippedCount;
    document.getElementById('deliveredOrders').textContent = deliveredCount;
    document.getElementById('cancelledOrders').textContent = cancelledCount;
}

function updateOrderCount() {
    const totalCount = allOrders.length;
    const orderCountElement = document.getElementById('orderCount');
    orderCountElement.textContent = `${totalCount} order${totalCount !== 1 ? 's' : ''}`;
}

// Update status function
function updateStatus(orderId, status) {
    // Show confirmation
    if (!confirm(`Change order #${orderId} status to "${status}"?`)) {
        // Reset dropdown to original value by reloading orders
        loadOrders();
        return;
    }
    
    // Update UI immediately for better UX
    const selectElement = event.target;
    const oldClass = selectElement.className.match(/status-select \w+/);
    if (oldClass) {
        selectElement.className = `status-select ${getStatusClass(status)}`;
    }
    
    // Make API call
    fetch("http://localhost:8080/admin/updateOrderStatus", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderId, status })
    })
    .then(response => {
        if(response.ok) {
            alert("✓ Order status updated successfully!");
            
            // Update local data
            const orderIndex = allOrders.findIndex(o => o.orderId === orderId);
            if (orderIndex > -1) {
                allOrders[orderIndex].status = status;
            }
            
            // Update statistics
            updateStatistics(allOrders);
        } else {
            alert("✗ Failed to update order status");
            // Revert dropdown on error
            loadOrders();
        }
    })
    .catch(error => {
        console.error(error);
        alert("✗ Network error. Please try again.");
        loadOrders();
    });
}

// View order details
function viewOrder(orderId) {
    alert("View order details for Order ID: " + orderId);
    // You can implement modal or redirect here
    // For example: window.location.href = `/admin/order-details/${orderId}`;
}

// Helper functions
function formatCurrency(amount) {
    return parseFloat(amount).toFixed(2);
}

function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'placed': return 'placed';
        case 'shipped': return 'shipped';
        case 'delivered': return 'delivered';
        case 'cancelled': return 'cancelled';
        default: return '';
    }
}

function showLoadingState() {
    let tableBody = document.getElementById("ordersTableBody");
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-muted">Loading orders...</p>
            </td>
        </tr>
    `;
}

function showErrorState(message) {
    let tableBody = document.getElementById("ordersTableBody");
    tableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <p class="text-danger">${message}</p>
                <button class="btn btn-primary mt-2" onclick="loadOrders()">
                    <i class="fas fa-redo me-2"></i>Retry
                </button>
            </td>
        </tr>
    `;
}