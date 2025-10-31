// Products state
let products = [];
let selectedProductId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        await loadProducts();
        setupEventListeners();
        setupImagePreviews();
    } catch (error) {
        console.error('Error initializing stock page:', error);
        ToastNotification.error('Sayfa yüklenirken hata oluştu');
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
        ToastNotification.error('Ürünler yüklenirken hata oluştu');
    }
}

// Get category-based image
function getCategoryImage(category, isDark) {
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
}

// Display products
function displayProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${product.image_url || getCategoryImage(product.category, document.documentElement.classList.contains('dark-theme'))}" 
                     alt="${product.name}"
                     class="product-image-preview rounded"
                     onerror="this.src='${getCategoryImage(product.category, document.documentElement.classList.contains('dark-theme'))}'">
            </td>
            <td>${product.name}</td>
            <td>
                <span class="badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}">
                    ${product.stock} pcs
                </span>
            </td>
            <td>${product.cost_price ? parseFloat(product.cost_price).toFixed(2) : '0.00'} ₺</td>
            <td>${parseFloat(product.price).toFixed(2)} ₺</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary edit-product" data-id="${product.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger delete-product" data-id="${product.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;

        // Add event listeners
        const editBtn = tr.querySelector('.edit-product');
        const deleteBtn = tr.querySelector('.delete-product');

        editBtn.addEventListener('click', () => openEditModal(product));
        deleteBtn.addEventListener('click', () => openDeleteModal(product.id));

        tbody.appendChild(tr);
    });
}

// Setup image previews
function setupImagePreviews() {
    // Add product image preview
    const productImage = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');

    productImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '';
            imagePreview.classList.add('d-none');
        }
    });

    // Edit product image preview
    const editProductImage = document.getElementById('editProductImage');
    const editImagePreview = document.getElementById('editImagePreview');

    editProductImage.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                editImagePreview.src = e.target.result;
                editImagePreview.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Open edit modal
function openEditModal(product) {
    selectedProductId = product.id;
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editStockQty').value = product.stock;
    document.getElementById('editCostPrice').value = product.cost_price || '';
    document.getElementById('editSalePrice').value = product.price;
    const isDarkTheme = document.documentElement.classList.contains('dark-theme');
    const fallbackImage = getCategoryImage(product.category, isDarkTheme);
    document.getElementById('editImagePreview').src = product.image_url || fallbackImage;

    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

// Open delete modal
function openDeleteModal(productId) {
    selectedProductId = productId;
    const modal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    modal.show();
}

// Setup event listeners
function setupEventListeners() {
    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const auth = Auth.checkAuth();
            if (!auth) return;

            const formData = new FormData();
            formData.append('name', document.getElementById('productName').value);
            formData.append('stock', document.getElementById('stockQty').value);
            formData.append('cost_price', document.getElementById('costPrice').value);
            formData.append('price', document.getElementById('salePrice').value);
            formData.append('image', document.getElementById('productImage').files[0]);

            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error creating product');
            }

            // Reset form and close modal
            e.target.reset();
            document.getElementById('imagePreview').src = '';
            document.getElementById('imagePreview').classList.add('d-none');
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();

            // Reload products
            await loadProducts();
            ToastNotification.success('Ürün başarıyla oluşturuldu');
        } catch (error) {
            console.error('Error adding product:', error);
            ToastNotification.error('Ürün oluşturulurken hata oluştu');
        }
    });

    // Edit product form
    document.getElementById('editProductForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const auth = Auth.checkAuth();
            if (!auth) return;

            const formData = new FormData();
            formData.append('name', document.getElementById('editProductName').value);
            formData.append('stock', document.getElementById('editStockQty').value);
            formData.append('cost_price', document.getElementById('editCostPrice').value);
            formData.append('price', document.getElementById('editSalePrice').value);

            const imageFile = document.getElementById('editProductImage').files[0];
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await fetch(`/api/products/${selectedProductId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error updating product');
            }

            // Reset form and close modal
            e.target.reset();
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();

            // Reload products
            await loadProducts();
            ToastNotification.success('Ürün başarıyla güncellendi');
        } catch (error) {
            console.error('Error updating product:', error);
            ToastNotification.error('Ürün güncellenirken hata oluştu');
        }
    });

    // Delete product
    document.getElementById('confirmDelete').addEventListener('click', async () => {
        try {
            const auth = Auth.checkAuth();
            if (!auth) return;

            const response = await fetch(`/api/products/${selectedProductId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error deleting product');
            }

            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('deleteProductModal')).hide();

            // Reload products
            await loadProducts();
            ToastNotification.success('Ürün başarıyla silindi');
        } catch (error) {
            console.error('Error deleting product:', error);
            ToastNotification.error('Ürün silinirken hata oluştu');
        }
    });

    // Search products
    document.getElementById('searchProducts').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            (product.name || '').toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });

    // Sort products
    document.getElementById('sortProducts').addEventListener('change', (e) => {
        const [field, direction] = e.target.value.split('-');
        const sortedProducts = [...products].sort((a, b) => {
            let aValue, bValue;
            if (field === 'name') {
                aValue = (a.name || '').toLowerCase();
                bValue = (b.name || '').toLowerCase();
            } else if (field === 'stock') {
                aValue = Number(a.stock) || 0;
                bValue = Number(b.stock) || 0;
            } else {
                return 0;
            }
            return direction === 'asc' 
                ? (aValue > bValue ? 1 : (aValue < bValue ? -1 : 0))
                : (aValue < bValue ? 1 : (aValue > bValue ? -1 : 0));
        });
        displayProducts(sortedProducts);
    });
}

// Show alert message