// Cart state
let cart = [];
let products = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        await loadProducts();
        setupEventListeners();
    } catch (error) {
        console.error('Error initializing sales page:', error);
        showAlert('An error occurred while loading the page', 'danger');
    }
});

// Load products
async function loadProducts() {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        const response = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error loading products');
        }

        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error loading products', 'danger');
    }
}

// Display products
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    const template = document.getElementById('productTemplate');
    grid.innerHTML = '';

    products.forEach(product => {
        const clone = template.content.cloneNode(true);
        
        // Set product data
        const card = clone.querySelector('.product-card');
        const img = clone.querySelector('.product-image');
        const name = clone.querySelector('.product-name');
        const price = clone.querySelector('.product-price');
        const stock = clone.querySelector('.product-stock');
        const stockBadge = clone.querySelector('.stock-badge');
        const addButton = clone.querySelector('.add-to-cart');
        const quantityInput = clone.querySelector('.product-quantity');

        // Set image with category-based and theme-aware fallback
        const isDarkTheme = document.documentElement.classList.contains('dark-theme');
        const getCategoryImage = (category, isDark) => {
            const categoryMap = {
                'Bakery': isDark ? 'images/bakery-placeholder-dark.svg' : 'images/bakery-placeholder.svg',
                'Coffee': isDark ? 'images/coffee-placeholder-dark.svg' : 'images/coffee-placeholder.svg',
                'Dessert': isDark ? 'images/dessert-placeholder-dark.svg' : 'images/dessert-placeholder.svg',
                'Pastry': isDark ? 'images/dessert-placeholder-dark.svg' : 'images/dessert-placeholder.svg',
                'Sandwich': isDark ? 'images/sandwich-placeholder-dark.svg' : 'images/sandwich-placeholder.svg',
                'Salad': isDark ? 'images/sandwich-placeholder-dark.svg' : 'images/sandwich-placeholder.svg',
                'Hot Beverage': isDark ? 'images/coffee-placeholder-dark.svg' : 'images/coffee-placeholder.svg',
                'Cold Beverage': isDark ? 'images/coffee-placeholder-dark.svg' : 'images/coffee-placeholder.svg',
                'Snack': isDark ? 'images/dessert-placeholder-dark.svg' : 'images/dessert-placeholder.svg'
            };
            return categoryMap[category] || (isDark ? 'images/product-placeholder-dark.svg' : 'images/product-placeholder.svg');
        };
        
        const fallbackImage = getCategoryImage(product.category, isDarkTheme);
        img.src = product.image_url || fallbackImage;
        img.onerror = function() { 
            this.src = fallbackImage; 
        };
        img.alt = product.name;
        name.textContent = product.name;
        price.textContent = `${parseFloat(product.price).toFixed(2)} ₺`;
        stock.textContent = `Stock: ${product.stock}`;
        stockBadge.textContent = `${product.stock} pcs`;

        // Disable add button if no stock
        if (product.stock <= 0) {
            addButton.disabled = true;
            addButton.innerHTML = '<i class="bi bi-x-circle me-2"></i>Out of Stock';
            stockBadge.classList.remove('bg-primary');
            stockBadge.classList.add('bg-danger');
        }

        // Set max quantity
        quantityInput.max = product.stock;

        // Add to cart handler
        addButton.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            addToCart(product, quantity);
        });

        // Quantity controls
        const decreaseBtn = clone.querySelector('.decrease-quantity');
        const increaseBtn = clone.querySelector('.increase-quantity');

        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < product.stock) {
                quantityInput.value = currentValue + 1;
            }
        });

        grid.appendChild(clone);
    });
}

// Add to cart
function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity <= product.stock) {
            existingItem.quantity = newQuantity;
        } else {
            showAlert('Insufficient stock!', 'warning');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            quantity: quantity
        });
    }

    updateCart();
    
    // Butonu güncelle ve devre dışı bırak
    const button = event.currentTarget;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="bi bi-check-circle me-2"></i>Added to Cart';
    button.disabled = true;
    button.classList.remove('btn-primary');
    button.classList.add('btn-success');
    
    // 2 saniye sonra butonu eski haline getir
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
    }, 2000);
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const template = document.getElementById('cartItemTemplate');
    const cartCount = document.getElementById('cartCount');
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-muted my-4">Your cart is empty</p>';
        cartCount.textContent = '0';
        updateCartTotals();
        return;
    }

    cart.forEach(item => {
        const clone = template.content.cloneNode(true);
        
        const img = clone.querySelector('.cart-item-image');
        const name = clone.querySelector('.cart-item-name');
        const price = clone.querySelector('.cart-item-price');
        const quantity = clone.querySelector('.item-quantity');
        const removeBtn = clone.querySelector('.remove-item');
        const decreaseBtn = clone.querySelector('.decrease-quantity');
        const increaseBtn = clone.querySelector('.increase-quantity');

        img.src = item.image || 'images/no-image.svg';
        img.onerror = function() { this.src = 'images/no-image.svg'; };
        img.alt = item.name;
        name.textContent = item.name;
        price.textContent = `${(item.price * item.quantity).toFixed(2)} ₺`;
        quantity.value = item.quantity;

        removeBtn.addEventListener('click', () => {
            cart = cart.filter(i => i.id !== item.id);
            updateCart();
        });

        decreaseBtn.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                updateCart();
            }
        });

        increaseBtn.addEventListener('click', () => {
            const product = products.find(p => p.id === item.id);
            if (item.quantity < product.stock) {
                item.quantity++;
                updateCart();
            }
        });

        cartItems.appendChild(clone);
    });

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartTotals();
}

// Update cart totals
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    document.getElementById('cartSubtotal').textContent = `${subtotal.toFixed(2)} ₺`;
    document.getElementById('cartTax').textContent = `${tax.toFixed(2)} ₺`;
    document.getElementById('cartTotal').textContent = `${total.toFixed(2)} ₺`;
}

// Setup event listeners
function setupEventListeners() {
    // Clear cart
    document.getElementById('clearCart').addEventListener('click', () => {
        cart = [];
        updateCart();
        showAlert('Cart cleared', 'info');
    });

    // Complete sale
    document.getElementById('completeSale').addEventListener('click', async () => {
        if (cart.length === 0) {
            showAlert('Cart is empty!', 'warning');
            return;
        }

        try {
            const auth = Auth.checkAuth();
            if (!auth) return;

            // Satış verilerini hazırla
            const saleData = {
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price)
                }))
            };

            console.log('Sending sale data:', saleData); // Debug için

            const response = await fetch('/api/sales/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify(saleData)
            });

            console.log('Response status:', response.status); // Debug için

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred while completing the sale');
            }

            // Başarılı satış
            cart = [];
            updateCart();
            await loadProducts(); // Stok durumunu güncelle
            showAlert('Sale completed successfully', 'success');

            // Sepet penceresini kapat
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
            offcanvas.hide();

        } catch (error) {
            console.error('Error completing sale:', error);
            showAlert(error.message || 'An error occurred while completing the sale', 'danger');
        }
    });

    // Search products
    const searchInput = document.getElementById('searchProducts');
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    // Sort products
    const sortSelect = document.getElementById('sortProducts');
    sortSelect.addEventListener('change', () => {
        const [field, direction] = sortSelect.value.split('-');
        const sortedProducts = [...products].sort((a, b) => {
            const aValue = field === 'name' ? a.name : a.price;
            const bValue = field === 'name' ? b.name : b.price;
            return direction === 'asc' 
                ? aValue > bValue ? 1 : -1
                : aValue < bValue ? 1 : -1;
        });
        displayProducts(sortedProducts);
    });
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed bottom-0 start-0 m-3`;
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
} 