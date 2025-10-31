// Dashboard functionality
let salesChart = null;
let dashboardData = {};

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

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        await loadDashboardData();
        setupEventListeners();
        updateDateTime();
        setInterval(updateDateTime, 1000);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        ToastNotification.error('Dashboard yüklenirken hata oluştu');
    }
});

// Load dashboard data
async function loadDashboardData() {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        // Load today's sales
        const today = new Date().toISOString().split('T')[0];
        const salesResponse = await fetch(`/api/sales?date=${today}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (salesResponse.ok) {
            const sales = await salesResponse.json();
            updateTodayStats(sales);
        }

        // Load products for low stock count
        const productsResponse = await fetch('/api/products', {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (productsResponse.ok) {
            const products = await productsResponse.json();
            updateProductStats(products);
        }

        // Load sales data for chart
        const chartResponse = await fetch('/api/sales?days=7', {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (chartResponse.ok) {
            const salesData = await chartResponse.json();
            updateSalesChart(salesData);
        }

        // Load recent sales
        const recentResponse = await fetch('/api/sales?limit=10', {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (recentResponse.ok) {
            const recentSales = await recentResponse.json();
            updateRecentSales(recentSales);
        }

        // Load top products
        const topProductsResponse = await fetch('/api/sales/top-products?limit=5', {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (topProductsResponse.ok) {
            const topProducts = await topProductsResponse.json();
            updateTopProducts(topProducts);
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        ToastNotification.error('Veriler yüklenirken hata oluştu');
    }
}

// Update today's statistics
function updateTodayStats(sales) {
    const todaySales = sales.reduce((sum, sale) => sum + (sale.quantity * sale.price), 0);
    const todayOrders = sales.length;

    document.getElementById('todaySales').textContent = todaySales.toFixed(2) + ' ₺';
    document.getElementById('todayOrders').textContent = todayOrders;
}

// Update product statistics
function updateProductStats(products) {
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock < 10).length;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('lowStockItems').textContent = lowStockItems;
}

// Update sales chart
function updateSalesChart(salesData) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    if (salesChart) {
        salesChart.destroy();
    }

    // Group sales by date
    const salesByDate = {};
    salesData.forEach(sale => {
        const date = new Date(sale.date).toISOString().split('T')[0];
        if (!salesByDate[date]) {
            salesByDate[date] = 0;
        }
        salesByDate[date] += sale.quantity * sale.price;
    });

    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        last7Days.push({
            date: dateStr,
            sales: salesByDate[dateStr] || 0
        });
    }

    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => new Date(d.date).toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Satış (₺)',
                data: last7Days.map(d => d.sales),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0) + ' ₺';
                        }
                    }
                }
            }
        }
    });
}

// Update recent sales table
function updateRecentSales(sales) {
    const tbody = document.getElementById('recentSalesTable');
    tbody.innerHTML = '';

    sales.slice(0, 5).forEach(sale => {
        const tr = document.createElement('tr');
        const saleDate = new Date(sale.date);
        const timeStr = saleDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <i class="bi bi-clock text-muted me-2"></i>
                    <span class="small">${timeStr}</span>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${sale.product?.image_url || getCategoryImage(sale.product?.category, document.documentElement.classList.contains('dark-theme'))}" 
                         alt="${sale.product?.name || 'Ürün'}" 
                         class="rounded me-2" 
                         style="width: 32px; height: 32px; object-fit: cover;"
                         onerror="this.src='${getCategoryImage(sale.product?.category, document.documentElement.classList.contains('dark-theme'))}'">
                    <span class="fw-medium">${sale.product?.name || 'Bilinmeyen Ürün'}</span>
                </div>
            </td>
            <td>
                <span class="badge bg-primary">${sale.quantity} adet</span>
            </td>
            <td>
                <span class="fw-bold text-success">${(sale.quantity * sale.price).toFixed(2)} ₺</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Update top products list
function updateTopProducts(products) {
    const container = document.getElementById('topProductsList');
    container.innerHTML = '';

    products.forEach((product, index) => {
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center mb-3';
        
        div.innerHTML = `
            <div class="flex-shrink-0">
                <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                     style="width: 40px; height: 40px;">
                    <span class="fw-bold text-primary">${index + 1}</span>
                </div>
            </div>
            <div class="flex-grow-1 ms-3">
                <div class="d-flex align-items-center">
                    <img src="${product.image_url || getCategoryImage(product.category, document.documentElement.classList.contains('dark-theme'))}" 
                         alt="${product.name}" 
                         class="rounded me-2" 
                         style="width: 32px; height: 32px; object-fit: cover;"
                         onerror="this.src='${getCategoryImage(product.category, document.documentElement.classList.contains('dark-theme'))}'">
                    <div>
                        <h6 class="mb-0 fw-medium">${product.name}</h6>
                        <small class="text-muted">${product.total_sold || 0} adet satıldı</small>
                    </div>
                </div>
            </div>
            <div class="flex-shrink-0">
                <span class="fw-bold text-success">${(product.total_revenue || 0).toFixed(2)} ₺</span>
            </div>
        `;
        
        container.appendChild(div);
    });
}

// Update current date and time
function updateDateTime() {
    const now = new Date();
    const dateTimeStr = now.toLocaleString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const element = document.getElementById('currentDateTime');
    if (element) {
        element.textContent = dateTimeStr;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Chart period buttons
    document.querySelectorAll('[data-period]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Update active button
            document.querySelectorAll('[data-period]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const period = e.target.dataset.period;
            await loadChartData(period);
        });
    });
}

// Load chart data for specific period
async function loadChartData(days) {
    try {
        const auth = Auth.checkAuth();
        if (!auth) return;

        const response = await fetch(`/api/sales?days=${days}`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });

        if (response.ok) {
            const salesData = await response.json();
            updateSalesChart(salesData);
        }
    } catch (error) {
        console.error('Error loading chart data:', error);
        ToastNotification.error('Grafik verileri yüklenirken hata oluştu');
    }
}
