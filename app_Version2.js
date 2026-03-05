// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartSummary();
    }
}

function loadCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    
    if (!cartItemsDiv) return;
    
    if (cart.length === 0) {
        cartItemsDiv.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    cartItemsDiv.innerHTML = '';
    
    cart.forEach(product => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div>
                <div class="cart-item-details">
                    <h4>${product.name}</h4>
                    <p>High quality organic product</p>
                    <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                    <div class="quantity-control">
                        <button onclick="updateQuantity(${product.id}, ${(product.quantity || 1) - 1})">−</button>
                        <span>${product.quantity || 1}</span>
                        <button onclick="updateQuantity(${product.id}, ${(product.quantity || 1) + 1})">+</button>
                    </div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${product.id})">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });
    
    if (emptyCart) emptyCart.style.display = 'none';
    document.querySelector('.cart-summary').style.display = 'block';
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shipping = cart.length > 0 ? 5 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(message) {
    showToast(message, 'error');
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#6b9d3e' : '#e74c3c'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize
updateCartCount();

if (document.querySelector('.cart-items')) {
    loadCartItems();
}