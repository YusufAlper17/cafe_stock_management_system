// Global chart instances
let salesChart = null;
let topProductsChart = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    const auth = Auth.checkAuth();
    if (!auth) {
        showAlert('Oturum bulunamadı!', 'danger');
        return;
    }

    // Set default date range (today)
    const today = new Date();
    const todayStr = formatDateToISO(today);

    // Set both start and end date to today
    document.getElementById('startDate').value = todayStr;
    document.getElementById('endDate').value = todayStr;

    // Initialize charts
    initializeCharts();

    // Load initial data
    loadReports();

    // Setup event listeners
    setupEventListeners();
});

// Format date to ISO string for API
function formatDateToISO(date) {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

// Format date for display
function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    const lang = localStorage.getItem('lang') || 'en';
    const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
    return date.toLocaleString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Setup event listeners
function setupEventListeners() {
    // Date range change
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateQuickFilterStates();
            loadReports();
        });
    });

    // Quick date filters
    setupQuickDateFilters();

    // Chart parameter change
    const paramSelect = document.getElementById('chartParam');
    if (paramSelect) {
        paramSelect.addEventListener('change', () => {
            if (window.currentChartData) {
                updateCharts(window.currentChartData);
            }
        });
    }

    // Filter date button
    const filterDateBtn = document.getElementById('filterDate');
    if (filterDateBtn) {
        filterDateBtn.addEventListener('click', loadReports);
    }

    // Top products filter
    const filterLinks = document.querySelectorAll('[data-filter]');
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (window.currentChartData) {
                updateCharts(window.currentChartData);
            }
        });
    });

    // Export button
    const exportBtn = document.getElementById('exportSales');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportSalesData);
    }
}

// Setup quick date filters
function setupQuickDateFilters() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    // Today filter
    document.getElementById('todayFilter').addEventListener('click', () => {
        const today = new Date();
        const todayStr = formatDateToISO(today);
        
        startDateInput.value = todayStr;
        endDateInput.value = todayStr;
        
        // Highlight active button
        updateQuickFilterStates();
        loadReports();
    });

    // Yesterday filter
    document.getElementById('yesterdayFilter').addEventListener('click', () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDateToISO(yesterday);
        
        startDateInput.value = yesterdayStr;
        endDateInput.value = yesterdayStr;
        
        // Highlight active button
        updateQuickFilterStates();
        loadReports();
    });

    // Last 7 days filter
    document.getElementById('lastWeekFilter').addEventListener('click', () => {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 6); // -6 because we want to include today
        
        startDateInput.value = formatDateToISO(lastWeek);
        endDateInput.value = formatDateToISO(today);
        
        // Highlight active button
        updateQuickFilterStates();
        loadReports();
    });

    // Last 30 days filter
    document.getElementById('lastMonthFilter').addEventListener('click', () => {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setDate(lastMonth.getDate() - 29); // -29 because we want to include today
        
        startDateInput.value = formatDateToISO(lastMonth);
        endDateInput.value = formatDateToISO(today);
        
        // Highlight active button
        updateQuickFilterStates();
        loadReports();
    });
}

// Add active state to quick filter buttons
function updateQuickFilterStates() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Remove active class from all buttons
    document.querySelectorAll('.btn-outline-secondary').forEach(btn => {
        btn.classList.remove('active');
    });

    // Get today's date in YYYY-MM-DD format
    const today = formatDateToISO(new Date());
    
    // Get yesterday's date in YYYY-MM-DD format
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateToISO(yesterday);
    
    // Get last week's start date
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 6);
    const lastWeekStartStr = formatDateToISO(lastWeekStart);
    
    // Get last month's start date
    const lastMonthStart = new Date();
    lastMonthStart.setDate(lastMonthStart.getDate() - 29);
    const lastMonthStartStr = formatDateToISO(lastMonthStart);

    // Check which filter is active
    if (startDate === today && endDate === today) {
        document.getElementById('todayFilter').classList.add('active');
    } else if (startDate === yesterdayStr && endDate === yesterdayStr) {
        document.getElementById('yesterdayFilter').classList.add('active');
    } else if (startDate === lastWeekStartStr && endDate === today) {
        document.getElementById('lastWeekFilter').classList.add('active');
    } else if (startDate === lastMonthStartStr && endDate === today) {
        document.getElementById('lastMonthFilter').classList.add('active');
    }
}

// Initialize charts
function initializeCharts() {
    // Initialize sales chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#000',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 5,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y || 0;
                            if (context.dataset.label === 'Sales Count') {
                                return `${context.dataset.label}: ${value.toFixed(0)}`;
                            }
                            return `${context.dataset.label}: ${value.toFixed(2)} ₺`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb'
                    },
                    ticks: {
                        callback: value => `${value.toFixed(2)} ₺`
                    }
                }
            }
        }
    });

    // Initialize top products chart
    const topProductsCtx = document.getElementById('topProductsChart').getContext('2d');
    topProductsChart = new Chart(topProductsCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#4f46e5',
                    '#06b6d4',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#000',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 5,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw || 0;
                            const quantity = context.dataset.quantities?.[context.dataIndex] || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                            return [
                                `Revenue: ${value.toFixed(2)} ₺ (${percentage}%)`,
                                `Sales Count: ${quantity}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Load reports data
async function loadReports() {
    try {
        const auth = Auth.checkAuth();
        if (!auth) {
            console.error('Auth not found');
            showAlert('Oturum bulunamadı!', 'danger');
            return;
        }

        const startDate = document.getElementById('startDate')?.value;
        const endDate = document.getElementById('endDate')?.value;

        // Debug için tarih bilgilerini logla
        console.log('Date selection:', {
            startDate,
            endDate,
            startLocal: startDate ? new Date(startDate).toLocaleString() : null,
            endLocal: endDate ? new Date(endDate).toLocaleString() : null,
            currentTime: new Date().toLocaleString()
        });

        if (!startDate || !endDate) {
            console.error('Invalid date range:', { startDate, endDate });
            showAlert('Please select a valid date range!', 'warning');
            return;
        }

        // Validate date range
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (start > end) {
            showAlert('Start date cannot be after end date!', 'warning');
            return;
        }

        // Show loading state
        setLoadingState(true);

        console.log('Fetching sales data...', { 
            startDate, 
            endDate,
            startLocal: start.toLocaleString(),
            endLocal: end.toLocaleString()
        });

        const response = await fetch(`/api/sales/history?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${auth.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', { status: response.status, body: errorText });
            throw new Error(`Error loading data: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received sales data:', {
            success: data.success,
            salesCount: data.sales?.length,
            summary: data.summary
        });

        if (!data.success) {
            console.error('API returned error:', data);
            throw new Error(data.message || 'Failed to fetch data');
        }

        if (!data.sales || !Array.isArray(data.sales)) {
            console.error('Invalid sales data format:', data);
            throw new Error('Invalid data format');
        }

        if (data.sales.length === 0) {
            console.log('No sales data found for the selected period');
            resetUI();
            showAlert('No sales data for the selected period.', 'info');
            return;
        }

        console.log('Processing sales data...');
        const processedData = processReportData(data.sales);
        window.currentChartData = processedData;

        // Update UI components safely
        try {
            if (data.summary) {
                displaySalesSummary(data.summary);
            }
            updateCharts(processedData);
            displaySalesTable(data.sales);
            console.log('Reports updated successfully');
        } catch (uiError) {
            console.error('Error updating UI:', uiError);
            showAlert('Veriler alındı fakat görüntülenirken hata oluştu.', 'warning');
        }

        // Update quick filter states
        updateQuickFilterStates();

    } catch (error) {
        console.error('Error in loadReports:', error);
        showAlert(`${error.message}`, 'danger');
        resetUI();
    } finally {
        setLoadingState(false);
    }
}

// Process report data
function processReportData(sales) {
    if (!Array.isArray(sales) || sales.length === 0) {
        return {
            daily_sales: [],
            top_products: [],
            summary: {
                total_sales: 0,
                total_profit: 0,
                total_orders: 0,
                average_basket: 0
            }
        };
    }

    // Group sales by date
    const salesByDate = {};
    const productStats = {};
    let totalSales = 0;
    let totalProfit = 0;

    sales.forEach(sale => {
        try {
            // Convert UTC date to Turkish time
            const saleDate = new Date(sale.date);
            const dateStr = saleDate.toLocaleString('tr-TR', {
                timeZone: 'Europe/Istanbul',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Initialize date group if not exists
            if (!salesByDate[dateStr]) {
                salesByDate[dateStr] = {
                    total: 0,
                    profit: 0,
                    count: 0
                };
            }

            // Calculate totals
            const saleTotal = Number(sale.total) || 0;
            const saleProfit = Number(sale.profit) || 0;

            // Add to date group
            salesByDate[dateStr].total += saleTotal;
            salesByDate[dateStr].profit += saleProfit;
            salesByDate[dateStr].count++;

            // Process product stats
            if (Array.isArray(sale.items)) {
                sale.items.forEach(item => {
                    const productName = item.product_name || 'Bilinmeyen Ürün';
                    if (!productStats[productName]) {
                        productStats[productName] = {
                            total_quantity: 0,
                            total_revenue: 0
                        };
                    }
                    const quantity = Number(item.quantity) || 0;
                    const price = Number(item.price) || 0;
                    productStats[productName].total_quantity += quantity;
                    productStats[productName].total_revenue += quantity * price;
                });
            }

            // Update totals
            totalSales += saleTotal;
            totalProfit += saleProfit;
        } catch (error) {
            console.error('Error processing sale:', error, sale);
        }
    });

    // Convert grouped data to arrays
    const daily_sales = Object.entries(salesByDate).map(([date, data]) => ({
        date,
        total: Number(data.total),
        profit: Number(data.profit),
        count: Number(data.count)
    }));

    // Sort daily sales by date
    daily_sales.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get top products by revenue
    const top_products = Object.entries(productStats)
        .map(([name, stats]) => ({
            name,
            total_quantity: Number(stats.total_quantity),
            total_revenue: Number(stats.total_revenue)
        }))
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 5);

    return {
        daily_sales,
        top_products,
        summary: {
            total_sales: totalSales,
            total_profit: totalProfit,
            total_orders: sales.length,
            average_basket: sales.length > 0 ? totalSales / sales.length : 0
        }
    };
}

// Update charts with processed data
function updateCharts(data) {
    // Update sales chart
    const selectedParam = document.getElementById('chartParam')?.value || 'all';
    
    salesChart.data.labels = data.daily_sales.map(item => item.date);
    salesChart.data.datasets = [];

    if (selectedParam === 'all' || selectedParam === 'sales') {
        salesChart.data.datasets.push({
            label: 'Sales',
            data: data.daily_sales.map(item => Number(item.total) || 0),
            borderColor: '#4f46e5',
            backgroundColor: '#4f46e520',
            fill: true
        });
    }

    if (selectedParam === 'all' || selectedParam === 'profit') {
        salesChart.data.datasets.push({
            label: 'Profit',
            data: data.daily_sales.map(item => Number(item.profit) || 0),
            borderColor: '#10b981',
            backgroundColor: '#10b98120',
            fill: true
        });
    }

    if (selectedParam === 'all' || selectedParam === 'count') {
        salesChart.data.datasets.push({
            label: 'Sales Count',
            data: data.daily_sales.map(item => Number(item.count) || 0),
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b20',
            fill: true,
            yAxisID: 'countAxis'
        });
    }

    salesChart.update();

    // Update top products chart
    const filterType = document.querySelector('[data-filter].active')?.dataset.filter || 'revenue';
    
    const sortedProducts = [...data.top_products].sort((a, b) => {
        if (filterType === 'revenue') {
            return b.total_revenue - a.total_revenue;
        }
        return b.total_quantity - a.total_quantity;
    });

    topProductsChart.data.labels = sortedProducts.map(item => item.name);
    topProductsChart.data.datasets[0].data = sortedProducts.map(item => 
        filterType === 'revenue' ? item.total_revenue : item.total_quantity
    );

    topProductsChart.update();
}

// Update summary cards
function updateSummaryCards(summary) {
    if (!summary) {
        console.error('Summary data is undefined');
        return;
    }

    const formatNumber = (value) => (Number(value) || 0).toFixed(2);

    document.getElementById('totalSales').textContent = `${formatNumber(summary.total_sales)} ₺`;
    document.getElementById('totalProfit').textContent = `${formatNumber(summary.total_profit)} ₺`;
    document.getElementById('totalOrders').textContent = Number(summary.total_orders) || 0;
    document.getElementById('averageBasket').textContent = `${formatNumber(summary.average_basket)} ₺`;
}

// Display sales table
function displaySalesTable(sales) {
    const tbody = document.getElementById('salesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!Array.isArray(sales)) {
        console.error('Sales data is not an array:', sales);
        return;
    }

    // Sort sales by date in descending order (newest first)
    const sortedSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedSales.forEach(sale => {
        try {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${formatDateForDisplay(sale.date)}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="badge bg-primary rounded-pill me-2">${sale.quantity || 0}</span>
                        ${Array.isArray(sale.items) ? sale.items.map(item => item.product_name || 'Bilinmeyen Ürün').join(', ') : ''}
                    </div>
                </td>
                <td>${(Number(sale.total) || 0).toFixed(2)} ₺</td>
                <td><span class="text-success">+${(Number(sale.profit) || 0).toFixed(2)} ₺</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="openSaleDetails(${JSON.stringify(sale).replace(/"/g, '&quot;')})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            `;

            tbody.appendChild(tr);
        } catch (error) {
            console.error('Error displaying sale row:', error, sale);
        }
    });
}

// Export sales data
function exportSalesData() {
    if (!window.currentChartData) return;

    const data = window.currentChartData;
    let csv = 'Tarih,Toplam Satış,Kar,Satış Adedi\n';
    
    data.daily_sales.forEach(day => {
        csv += `${day.date},${day.total},${day.profit},${day.count}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'satis_raporu.csv';
    link.click();
}

// Open sale details modal
function openSaleDetails(sale) {
    const tbody = document.getElementById('saleDetailsTableBody');
    tbody.innerHTML = '';

    sale.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.product_name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)} ₺</td>
            <td>${(item.quantity * item.price).toFixed(2)} ₺</td>
        `;
        tbody.appendChild(tr);
    });

    const subtotal = sale.total / 1.18;
    const tax = sale.total - subtotal;

    document.getElementById('saleSubtotal').textContent = `${subtotal.toFixed(2)} ₺`;
    document.getElementById('saleTax').textContent = `${tax.toFixed(2)} ₺`;
    document.getElementById('saleTotal').textContent = `${sale.total.toFixed(2)} ₺`;

    const modal = new bootstrap.Modal(document.getElementById('saleDetailsModal'));
    modal.show();
}

// Set loading state
function setLoadingState(loading) {
    const charts = ['salesChart', 'topProductsChart'];
    charts.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.opacity = loading ? '0.5' : '1';
        }
    });
}

// Reset UI
function resetUI() {
    // Helper function to safely update element text content
    const safeUpdateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`Element with id '${id}' not found while resetting UI`);
        }
    };

    // Reset summary cards safely
    safeUpdateElement('totalSales', '0.00 ₺');
    safeUpdateElement('totalProfit', '0.00 ₺');
    safeUpdateElement('totalTransactions', '0');
    safeUpdateElement('averageBasket', '0.00 ₺');
    safeUpdateElement('totalQuantity', '0');
    safeUpdateElement('averageQuantity', '0');
    safeUpdateElement('averageProfit', '0.00 ₺');

    // Reset charts safely
    try {
        if (salesChart) {
            salesChart.data.labels = [];
            salesChart.data.datasets = [];
            salesChart.update();
        }
        if (topProductsChart) {
            topProductsChart.data.labels = [];
            topProductsChart.data.datasets[0].data = [];
            topProductsChart.update();
        }
    } catch (chartError) {
        console.error('Error resetting charts:', chartError);
    }

    // Clear sales table safely
    try {
        const salesTableBody = document.getElementById('salesTableBody');
        if (salesTableBody) {
            salesTableBody.innerHTML = '';
        } else {
            console.warn('Sales table body element not found while resetting UI');
        }
    } catch (tableError) {
        console.error('Error clearing sales table:', tableError);
    }
}

// Add showAlert function if it doesn't exist
function showAlert(message, type = 'info') {
    try {
        const container = document.querySelector('.container-fluid');
        if (!container) {
            console.error('Container element not found for showing alert');
            return;
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
            try {
                if (alertDiv && alertDiv.parentNode) {
                    alertDiv.remove();
                }
            } catch (removeError) {
                console.warn('Error removing alert:', removeError);
            }
        }, 5000);
    } catch (error) {
        console.error('Error showing alert:', error, { message, type });
    }
}

// Display sales summary
function displaySalesSummary(summary) {
    if (!summary) {
        console.error('Summary data is undefined');
        return;
    }

    // Format currency values
    const formatCurrency = (value) => (Number(value) || 0).toFixed(2) + ' ₺';
    const formatQuantity = (value) => (Number(value) || 0).toFixed(1);

    // Helper function to safely update element text content
    const safeUpdateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.warn(`Element with id '${id}' not found`);
        }
    };

    // Update summary cards with safe element checks
    safeUpdateElement('totalSales', formatCurrency(summary.total_sales));
    safeUpdateElement('totalProfit', formatCurrency(summary.total_profit));
    safeUpdateElement('totalTransactions', summary.total_transactions);
    safeUpdateElement('averageBasket', formatCurrency(summary.average_basket));
    safeUpdateElement('totalQuantity', formatQuantity(summary.total_quantity));
    safeUpdateElement('averageQuantity', formatQuantity(summary.average_quantity));
    safeUpdateElement('averageProfit', formatCurrency(summary.average_profit));
} 