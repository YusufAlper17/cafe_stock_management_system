// Session management
class Auth {
    static checkAuth() {
        try {
            console.log('Checking authentication...');
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            
            console.log('Token exists:', !!token);
            console.log('User string exists:', !!userStr);
            
            if (!token || !userStr) {
                console.log('Missing token or user data');
                Auth.redirectToLogin();
                return null;
            }

            const user = JSON.parse(userStr);
            console.log('Parsed user data:', user);
            
            if (!user || !user.store_id) {
                console.log('Invalid user data or missing store_id');
                Auth.redirectToLogin();
                return null;
            }

            return { token, user };
        } catch (error) {
            console.error('Auth check error:', error);
            Auth.redirectToLogin();
            return null;
        }
    }

    static redirectToLogin() {
        console.log('Redirecting to login page...');
        console.log('Current path:', window.location.pathname);
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }

    static logout() {
        console.log('Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Auth.redirectToLogin();
    }

    static async initPage() {
        console.log('Initializing page...');
        const auth = Auth.checkAuth();
        if (!auth) {
            console.log('No auth data found during init');
            return null;
        }

        try {
            console.log('Loading user profile...');
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            if (!response.ok) {
                console.error('Profile request failed:', response.status);
                throw new Error('Failed to load user info');
            }

            const user = await response.json();
            console.log('Loaded user profile:', user);
            
            // Update UI
            const userInfoElement = document.getElementById('userInfo');
            if (userInfoElement) {
                userInfoElement.textContent = user.username;
            }

            // Initialize theme based on preference
            Theme.applySavedTheme();

            // Initialize language based on preference
            I18n.applySavedLanguage();
            
            // Setup logout button
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', Auth.logout);
            }

            // Setup sidebar toggle
            const toggleBtn = document.getElementById('toggleSidebar');
            const sidebar = document.querySelector('.sidebar');
            const content = document.querySelector('.content');
            
            if (toggleBtn && sidebar && content) {
                toggleBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('collapsed');
                    content.classList.toggle('expanded');
                });
            }

            return user;
        } catch (error) {
            console.error('Page initialization error:', error);
            Auth.redirectToLogin();
            return null;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing auth...');
    Auth.initPage();
}); 

// Simple Theme toggler
class Theme {
    static toggle() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    static applySavedTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

// Comprehensive client-side i18n
class I18n {
    static translations = {
        en: {
            // Navigation
            'nav.sales': 'Sales',
            'nav.stock': 'Stock Management',
            'nav.reports': 'Reports',
            'nav.dashboard': 'Dashboard',
            
            // Actions
            'action.logout': 'Logout',
            'action.login': 'Login',
            'action.add': 'Add',
            'action.edit': 'Edit',
            'action.delete': 'Delete',
            'action.save': 'Save',
            'action.cancel': 'Cancel',
            'action.close': 'Close',
            'action.search': 'Search',
            'action.filter': 'Filter',
            'action.export': 'Export',
            'action.print': 'Print',
            'action.clear': 'Clear',
            'action.refresh': 'Refresh',
            
            // Login
            'login.title': 'Restaurant & Stock Management',
            'login.subtitle': 'Sign in to your account',
            'login.username': 'Username',
            'login.password': 'Password',
            'login.signin': 'Sign In',
            'login.signingin': 'Signing in...',
            'login.remember': 'Remember me',
            
            // Theme
            'theme.toggle': 'Toggle Theme',
            'theme.light': 'Light Mode',
            'theme.dark': 'Dark Mode',
            
            // Language
            'lang.select': 'Select Language',
            'lang.en': 'English',
            'lang.tr': 'Turkish',
            
            // Sales
            'sales.title': 'Sales',
            'sales.cart': 'Cart',
            'sales.addToCart': 'Add to Cart',
            'sales.removeFromCart': 'Remove from Cart',
            'sales.clearCart': 'Clear Cart',
            'sales.completeSale': 'Complete Sale',
            'sales.emptyCart': 'Your cart is empty',
            'sales.subtotal': 'Subtotal',
            'sales.tax': 'VAT (18%)',
            'sales.total': 'Total',
            'sales.quantity': 'Quantity',
            'sales.price': 'Price',
            'sales.unitPrice': 'Unit Price',
            'sales.outOfStock': 'Out of Stock',
            'sales.stock': 'Stock',
            'sales.searchProducts': 'Search products...',
            'sales.sortBy': 'Sort by',
            'sales.addedToCart': 'Added to Cart',
            'sales.saleCompleted': 'Sale completed successfully',
            'sales.insufficientStock': 'Insufficient stock!',
            'sales.cartCleared': 'Cart cleared',
            
            // Stock
            'stock.title': 'Stock Management',
            'stock.addProduct': 'Add New Product',
            'stock.editProduct': 'Edit Product',
            'stock.deleteProduct': 'Delete Product',
            'stock.productName': 'Product Name',
            'stock.productImage': 'Product Image',
            'stock.stockQuantity': 'Stock Quantity',
            'stock.costPrice': 'Cost Price',
            'stock.salePrice': 'Sale Price',
            'stock.category': 'Category',
            'stock.actions': 'Actions',
            'stock.confirmDelete': 'Are you sure you want to delete this product?',
            'stock.cannotUndo': 'This action cannot be undone!',
            'stock.productAdded': 'Product added successfully',
            'stock.productUpdated': 'Product updated successfully',
            'stock.productDeleted': 'Product deleted successfully',
            
            // Reports
            'reports.title': 'Reports & Analytics',
            'reports.dateRange': 'Date Range',
            'reports.startDate': 'Start Date',
            'reports.endDate': 'End Date',
            'reports.today': 'Today',
            'reports.yesterday': 'Yesterday',
            'reports.last7days': 'Last 7 Days',
            'reports.last30days': 'Last 30 Days',
            'reports.customRange': 'Custom Range',
            'reports.totalSales': 'Total Sales',
            'reports.totalProfit': 'Total Profit',
            'reports.totalTransactions': 'Transactions',
            'reports.averageBasket': 'Average Basket',
            'reports.totalQuantity': 'Total Quantity',
            'reports.averageQuantity': 'Average Quantity',
            'reports.averageProfit': 'Average Profit',
            'reports.dailySales': 'Daily Sales',
            'reports.topProducts': 'Top Selling Products',
            'reports.salesHistory': 'Sales History',
            'reports.saleDetails': 'Sale Details',
            'reports.noData': 'No sales data for the selected period',
            'reports.byRevenue': 'By Revenue',
            'reports.byQuantity': 'By Quantity',
            'reports.exportPDF': 'Export PDF',
            'reports.exportExcel': 'Export Excel',
            'reports.date': 'Date',
            'reports.products': 'Products',
            'reports.profit': 'Profit',
            
            // Sort options
            'sort.nameAsc': 'Name (A-Z)',
            'sort.nameDesc': 'Name (Z-A)',
            'sort.priceAsc': 'Price (Low-High)',
            'sort.priceDesc': 'Price (High-Low)',
            'sort.stockAsc': 'Stock (Low-High)',
            'sort.stockDesc': 'Stock (High-Low)',
            
            // Messages
            'msg.error': 'Error',
            'msg.success': 'Success',
            'msg.warning': 'Warning',
            'msg.info': 'Info',
            'msg.loading': 'Loading...',
            'msg.noResults': 'No results found',
            'msg.sessionExpired': 'Session expired. Please login again.',
            'msg.invalidCredentials': 'Invalid username or password',
            'msg.networkError': 'Network error. Please check your connection.',
            
            // Common
            'common.yes': 'Yes',
            'common.no': 'No',
            'common.ok': 'OK',
            'common.image': 'Image',
            'common.name': 'Name',
            'common.cost': 'Cost',
            'common.pieces': 'pcs',
            'common.currency': '₺'
        },
        tr: {
            // Navigasyon
            'nav.sales': 'Satış',
            'nav.stock': 'Stok Yönetimi',
            'nav.reports': 'Raporlar',
            'nav.dashboard': 'Kontrol Paneli',
            
            // Eylemler
            'action.logout': 'Çıkış',
            'action.login': 'Giriş',
            'action.add': 'Ekle',
            'action.edit': 'Düzenle',
            'action.delete': 'Sil',
            'action.save': 'Kaydet',
            'action.cancel': 'İptal',
            'action.close': 'Kapat',
            'action.search': 'Ara',
            'action.filter': 'Filtrele',
            'action.export': 'Dışa Aktar',
            'action.print': 'Yazdır',
            'action.clear': 'Temizle',
            'action.refresh': 'Yenile',
            
            // Giriş
            'login.title': 'Restoran & Stok Yönetimi',
            'login.subtitle': 'Hesabınıza giriş yapın',
            'login.username': 'Kullanıcı Adı',
            'login.password': 'Şifre',
            'login.signin': 'Giriş Yap',
            'login.signingin': 'Giriş yapılıyor...',
            'login.remember': 'Beni hatırla',
            
            // Tema
            'theme.toggle': 'Tema Değiştir',
            'theme.light': 'Açık Mod',
            'theme.dark': 'Karanlık Mod',
            
            // Dil
            'lang.select': 'Dil Seçin',
            'lang.en': 'İngilizce',
            'lang.tr': 'Türkçe',
            
            // Satış
            'sales.title': 'Satış',
            'sales.cart': 'Sepet',
            'sales.addToCart': 'Sepete Ekle',
            'sales.removeFromCart': 'Sepetten Çıkar',
            'sales.clearCart': 'Sepeti Temizle',
            'sales.completeSale': 'Satışı Tamamla',
            'sales.emptyCart': 'Sepetiniz boş',
            'sales.subtotal': 'Ara Toplam',
            'sales.tax': 'KDV (%18)',
            'sales.total': 'Toplam',
            'sales.quantity': 'Miktar',
            'sales.price': 'Fiyat',
            'sales.unitPrice': 'Birim Fiyat',
            'sales.outOfStock': 'Stokta Yok',
            'sales.stock': 'Stok',
            'sales.searchProducts': 'Ürün ara...',
            'sales.sortBy': 'Sırala',
            'sales.addedToCart': 'Sepete Eklendi',
            'sales.saleCompleted': 'Satış başarıyla tamamlandı',
            'sales.insufficientStock': 'Yetersiz stok!',
            'sales.cartCleared': 'Sepet temizlendi',
            
            // Stok
            'stock.title': 'Stok Yönetimi',
            'stock.addProduct': 'Yeni Ürün Ekle',
            'stock.editProduct': 'Ürünü Düzenle',
            'stock.deleteProduct': 'Ürünü Sil',
            'stock.productName': 'Ürün Adı',
            'stock.productImage': 'Ürün Görseli',
            'stock.stockQuantity': 'Stok Miktarı',
            'stock.costPrice': 'Maliyet Fiyatı',
            'stock.salePrice': 'Satış Fiyatı',
            'stock.category': 'Kategori',
            'stock.actions': 'İşlemler',
            'stock.confirmDelete': 'Bu ürünü silmek istediğinizden emin misiniz?',
            'stock.cannotUndo': 'Bu işlem geri alınamaz!',
            'stock.productAdded': 'Ürün başarıyla eklendi',
            'stock.productUpdated': 'Ürün başarıyla güncellendi',
            'stock.productDeleted': 'Ürün başarıyla silindi',
            
            // Raporlar
            'reports.title': 'Raporlar ve Analiz',
            'reports.dateRange': 'Tarih Aralığı',
            'reports.startDate': 'Başlangıç Tarihi',
            'reports.endDate': 'Bitiş Tarihi',
            'reports.today': 'Bugün',
            'reports.yesterday': 'Dün',
            'reports.last7days': 'Son 7 Gün',
            'reports.last30days': 'Son 30 Gün',
            'reports.customRange': 'Özel Aralık',
            'reports.totalSales': 'Toplam Satış',
            'reports.totalProfit': 'Toplam Kar',
            'reports.totalTransactions': 'İşlem Sayısı',
            'reports.averageBasket': 'Ortalama Sepet',
            'reports.totalQuantity': 'Toplam Miktar',
            'reports.averageQuantity': 'Ortalama Miktar',
            'reports.averageProfit': 'Ortalama Kar',
            'reports.dailySales': 'Günlük Satışlar',
            'reports.topProducts': 'En Çok Satan Ürünler',
            'reports.salesHistory': 'Satış Geçmişi',
            'reports.saleDetails': 'Satış Detayları',
            'reports.noData': 'Seçilen dönem için satış verisi bulunamadı',
            'reports.byRevenue': 'Gelire Göre',
            'reports.byQuantity': 'Miktara Göre',
            'reports.exportPDF': 'PDF Olarak Dışa Aktar',
            'reports.exportExcel': 'Excel Olarak Dışa Aktar',
            'reports.date': 'Tarih',
            'reports.products': 'Ürünler',
            'reports.profit': 'Kar',
            
            // Sıralama seçenekleri
            'sort.nameAsc': 'İsim (A-Z)',
            'sort.nameDesc': 'İsim (Z-A)',
            'sort.priceAsc': 'Fiyat (Düşük-Yüksek)',
            'sort.priceDesc': 'Fiyat (Yüksek-Düşük)',
            'sort.stockAsc': 'Stok (Düşük-Yüksek)',
            'sort.stockDesc': 'Stok (Yüksek-Düşük)',
            
            // Mesajlar
            'msg.error': 'Hata',
            'msg.success': 'Başarılı',
            'msg.warning': 'Uyarı',
            'msg.info': 'Bilgi',
            'msg.loading': 'Yükleniyor...',
            'msg.noResults': 'Sonuç bulunamadı',
            'msg.sessionExpired': 'Oturum süresi doldu. Lütfen tekrar giriş yapın.',
            'msg.invalidCredentials': 'Geçersiz kullanıcı adı veya şifre',
            'msg.networkError': 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
            
            // Genel
            'common.yes': 'Evet',
            'common.no': 'Hayır',
            'common.ok': 'Tamam',
            'common.image': 'Görsel',
            'common.name': 'İsim',
            'common.cost': 'Maliyet',
            'common.pieces': 'adet',
            'common.currency': '₺'
        }
    };

    static t(key) {
        const lang = localStorage.getItem('lang') || 'en';
        return (I18n.translations[lang] && I18n.translations[lang][key]) || key;
    }

    static setLanguage(lang) {
        localStorage.setItem('lang', lang);
        I18n.applySavedLanguage();
        // Reload the page to apply translations to dynamic content
        window.location.reload();
    }

    static applySavedLanguage() {
        const lang = localStorage.getItem('lang') || 'en';
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = I18n.t(key);
            if (text) {
                // Check if element has placeholder attribute
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });
        document.documentElement.lang = lang;
        
        // Update active language button
        const langButtons = document.querySelectorAll('[id^="lang"]');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if ((lang === 'en' && btn.id === 'langEn') || (lang === 'tr' && btn.id === 'langTr')) {
                btn.classList.add('active');
            }
        });
    }
}