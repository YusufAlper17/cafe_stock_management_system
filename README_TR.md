# 🏪 Arzen — Restoran & Stok Yönetim Sistemi

<div align="center">

![Versiyon](https://img.shields.io/badge/versiyon-1.0.0-blue.svg)
![Lisans](https://img.shields.io/badge/lisans-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![PRs Hoşgeldiniz](https://img.shields.io/badge/PRs-ho%C5%9Fgeldiniz-brightgreen.svg)

Barkod okuyucu kullanmayan restoranlar, kafeler ve küçük işletmeler için tasarlanmış modern, tam özellikli Satış Noktası (POS) ve envanter yönetim sistemi.

[Özellikler](#-özellikler) • [Demo](#-demo-giriş-bilgileri) • [Kurulum](#-kurulum) • [Dokümantasyon](#-dokümantasyon) • [Teknoloji](#-teknoloji-yığını)

</div>

---

## 📋 İçindekiler

- [Genel Bakış](#-genel-bakış)
- [Özellikler](#-özellikler)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [API Dokümantasyonu](#-api-dokümantasyonu)
- [Proje Yapısı](#-proje-yapısı)
- [Yapılandırma](#-yapılandırma)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)
- [Destek](#-destek)

---

## 🎯 Genel Bakış

**Arzen**, barkod okuyucu kullanmayan fırınlar, kafeler ve restoranlar gibi küçük ve orta ölçekli işletmeler için özel olarak geliştirilmiş kapsamlı, web tabanlı bir stok ve satış yönetim sistemidir. Sistem şunları sağlar:

- Otomatik stok güncellemeleriyle **gerçek zamanlı envanter takibi**
- Hızlı ve verimli satışlar için **modern POS arayüzü**
- Güzel grafikler ve içgörülerle **gelişmiş analitikler**
- Birden fazla konumu olan işletmeler için **çoklu mağaza desteği**
- İngilizce ve Türkçe dil desteğiyle **uluslararasılaştırma**
- Her aydınlatma koşulunda rahat kullanım için **karanlık mod**

Günlük operasyonlar için mükemmel: sabah ürünlerinizi ekleyin, gün boyunca satın, nakit akışınızı takip edin ve kapsamlı raporlar oluşturun.

---

## ✨ Özellikler

### 🛍️ Satış Yönetimi (POS)
- Arama ve filtreleme ile **sezgisel ürün ızgarası**
- Gerçek zamanlı hesaplamalarla **alışveriş sepeti**
- +/- butonlarıyla **hızlı miktar ayarlamaları**
- Satış tamamlandığında **otomatik stok düşümü**
- **KDV hesaplaması** (varsayılan %18, yapılandırılabilir)
- Detaylı kayıtlarla **işlem geçmişi**

### 📦 Stok Yönetimi
- Ürünler için **tam CRUD işlemleri**
- Her ürün için önizlemeli **görsel yükleme**
- **Maliyet ve satış fiyatı** takibi
- Düşük stok uyarılarıyla **stok seviyesi izleme**
- **Kategori tabanlı organizasyon**
- **Toplu işlem** desteği

### 📊 Raporlar ve Analitikler
- Temel metriklerle **kapsamlı gösterge paneli**
- **Etkileşimli grafikler** (Chart.js destekli)
  - Günlük satış trendleri
  - En çok satan ürünler
  - Gelir vs. kar karşılaştırması
- Hızlı filtrelerle **özelleştirilebilir tarih aralıkları**
- **Detaylı satış dökümü**
- **Dışa aktarma yetenekleri** (CSV, PDF, Excel)
- **Ana Performans Göstergeleri**:
  - Toplam satış ve kar
  - Ortalama sepet boyutu
  - İşlem sayısı
  - Ürün performansı

### 🏢 Çoklu Mağaza Desteği
- Her konum için **bağımsız veri**
- **Mağazaya özel envanter** ve satışlar
- **Merkezi kullanıcı yönetimi**
- **Rol tabanlı erişim kontrolü**

### 🌍 Uluslararasılaştırma (i18n)
- **İngilizce** ve **Türkçe** dil desteği
- Herhangi bir sayfadan **kolay dil değiştirme**
- **Kalıcı dil tercihi**
- Hata mesajları dahil **tamamen çevrilmiş arayüz**

### 🎨 Modern UI/UX
- Masaüstü, tablet ve mobilde çalışan **duyarlı tasarım**
- Yumuşak geçişlerle **karanlık mod**
- Tutarlı stil için **Bootstrap 5**
- Kenar çubuğu menüsüyle **sezgisel navigasyon**
- Kullanıcı geri bildirimi için **toast bildirimleri**
- Onaylar için **modal diyaloglar**

### 🔐 Güvenlik
- Güvenli oturumlar için **JWT kimlik doğrulama**
- **Rol tabanlı yetkilendirme** (Yönetici, Personel)
- bcryptjs ile **şifre hashleme**
- **Korumalı API rotaları**
- HTTP başlık güvenliği için **Helmet.js**
- **CORS** yapılandırması

---

## 📸 Ekran Görüntüleri

### Giriş Sayfası
Tema ve dil seçimiyle modern giriş arayüzü
```
📱 Özellikler:
- Temiz, merkezli tasarım
- Tema değiştirici (Açık/Karanlık)
- Dil seçici (EN/TR)
- Beni hatırla seçeneği
```

### Satış (POS) Arayüzü
Ürün ızgarası ve alışveriş sepetiyle verimli satış noktası
```
🛒 Özellikler:
- Ürün arama ve sıralama
- Görsellerle görsel ürün kartları
- Hızlı sepete ekle
- Gerçek zamanlı sepet özeti
- Stok seviyesi göstergeleri
```

### Stok Yönetimi
Kolay CRUD işlemleriyle tam envanter kontrolü
```
📦 Özellikler:
- Görsellerle ürün listesi
- Ürün Ekle/Düzenle/Sil
- Önizlemeli görsel yükleme
- Maliyet ve satış fiyatı takibi
- Kategori yönetimi
```

### Raporlar ve Analitikler
Etkileşimli görselleştirmelerle kapsamlı içgörüler
```
📈 Özellikler:
- Günlük/Haftalık/Aylık görünümler
- Satış trendi grafikleri
- En iyi ürün analizi
- Kar takibi
- Dışa aktarma işlevi
```

---

## 🛠️ Teknoloji Yığını

### Backend
- **Çalışma Zamanı**: Node.js (v14+)
- **Framework**: Express.js
- **Veritabanı**: SQLite (varsayılan), PostgreSQL, MySQL desteklenir
- **ORM**: Sequelize
- **Kimlik Doğrulama**: JWT (jsonwebtoken)
- **Güvenlik**: Helmet.js, bcryptjs, CORS

### Frontend
- **HTML5** / **CSS3** / **Vanilla JavaScript**
- **UI Framework**: Bootstrap 5
- **İkonlar**: Bootstrap Icons
- **Grafikler**: Chart.js
- **HTTP**: Fetch API

### Geliştirme Araçları
- **Versiyon Kontrolü**: Git
- **Paket Yöneticisi**: npm
- **İşlem Yöneticisi**: nodemon (dev)
- **Veritabanı Migrasyonları**: Sequelize CLI
- **Kod Kalitesi**: ESLint (opsiyonel)

---

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- Git

### Adım 1: Depoyu Klonlayın
```bash
git clone https://github.com/kullaniciadi/arzen.git
cd arzen
```

### Adım 2: Bağımlılıkları Yükleyin
```bash
npm install
```

### Adım 3: Veritabanını Yapılandırın
Veritabanı ayarlarınız için `config/config.json` dosyasını düzenleyin. Varsayılan olarak SQLite kullanır:

```json
{
  "development": {
    "dialect": "sqlite",
    "storage": "./database.sqlite"
  }
}
```

PostgreSQL veya MySQL için buna göre güncelleyin:
```json
{
  "development": {
    "username": "kullanici_adiniz",
    "password": "sifreniz",
    "database": "arzen_db",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

### Adım 4: Migrasyonları Çalıştırın
```bash
npx sequelize-cli db:migrate
```

### Adım 5: Veritabanını Doldurun (Opsiyonel)
Mağazalar, kullanıcılar, ürünler ve satışlar dahil demo verilerle doldurun:
```bash
npx sequelize-cli db:seed:all
```

### Adım 6: Uygulamayı Başlatın
```bash
# Üretim modu
npm start

# Geliştirme modu (otomatik yenileme ile)
npm run dev
```

Uygulama `http://localhost:3000` adresinde kullanılabilir olacak

---

## 📖 Kullanım

### Demo Giriş Bilgileri
Doldurma işleminden sonra, giriş yapmak için şu kimlik bilgilerini kullanın:

| Kullanıcı Adı | Şifre | Rol | Mağaza |
|---------------|-------|-----|--------|
| admin1 | password123 | Yönetici | Mağaza 1 |
| admin2 | password123 | Yönetici | Mağaza 2 |
| staff1 | password123 | Personel | Mağaza 1 |

### Hızlı Başlangıç Kılavuzu

1. **Giriş**: Demo kimlik bilgilerini kullanın veya kendi kullanıcınızı oluşturun
2. **Ürün Ekle**: Stok Yönetimi'ne gidin ve ürünlerinizi görseller ve fiyatlarla ekleyin
3. **Satış Yap**: Satış sayfasına gidin, sepete ürün ekleyin ve işlemleri tamamlayın
4. **Raporları Görüntüle**: Analitik ve içgörüler için Raporlar sayfasını kontrol edin
5. **Yönet**: Ürünleri düzenleyin, stok seviyelerini ayarlayın ve gerektiğinde verileri dışa aktarın

### Günlük Operasyonlar için İş Akışı

**Sabah Hazırlığı:**
1. Sisteme giriş yapın
2. Mevcut stok seviyelerini gözden geçirin
3. Günlük yeni ürünler ekleyin
4. Gerekirse fiyatları güncelleyin

**Çalışma Saatleri Boyunca:**
1. Hızlı satışlar için POS arayüzünü kullanın
2. Stok otomatik olarak güncellenir
3. Satışları gerçek zamanlı izleyin

**Gün Sonu:**
1. Günlük satış raporu oluşturun
2. Kar ve geliri gözden geçirin
3. Düşük stoklu ürünleri kontrol edin
4. Ertesi gün için plan yapın

---

## 📡 API Dokümantasyonu

### Kimlik Doğrulama

#### Giriş
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin1",
  "password": "password123"
}
```

Yanıt:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin1",
    "role": "admin",
    "store_id": 1
  }
}
```

#### Profil Al
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Ürünler

#### Tüm Ürünleri Al
```http
GET /api/products
Authorization: Bearer {token}
```

#### Ürün Oluştur
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "Kruvasan",
  "stock": 50,
  "cost_price": 1.5,
  "price": 3.5,
  "category": "Fırın",
  "image": [dosya]
}
```

#### Ürün Güncelle
```http
PUT /api/products/:id
Authorization: Bearer {token}
```

#### Ürün Sil
```http
DELETE /api/products/:id
Authorization: Bearer {token}
```

### Satışlar

#### Satışı Tamamla
```http
POST /api/sales/complete
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 3.5
    }
  ]
}
```

#### Satış Geçmişini Al
```http
GET /api/sales/history?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

### Raporlar

#### Analitikleri Al
```http
GET /api/reports/analytics?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

---

## 📁 Proje Yapısı

```
arzen/
├── config/
│   └── config.json                 # Veritabanı yapılandırması
├── migrations/                      # Veritabanı migrasyonları
│   ├── 20231220_create_stores.js
│   ├── 20231220_create_users.js
│   └── 20231220_create_products.js
├── seeders/                        # Veritabanı seed dosyaları
│   └── 20251027000100_mock_products_and_sales.js
├── public/                         # Frontend varlıkları
│   ├── css/
│   │   ├── style.css              # Ana stiller
│   │   ├── login.css              # Giriş sayfası stilleri
│   │   ├── sales.css              # Satış sayfası stilleri
│   │   └── reports.css            # Raporlar sayfası stilleri
│   ├── js/
│   │   ├── auth.js                # Kimlik doğrulama & i18n
│   │   ├── sales.js               # Satış/POS mantığı
│   │   ├── stock.js               # Stok yönetimi
│   │   └── reports.js             # Raporlar & analitikler
│   ├── uploads/                   # Yüklenen ürün görselleri
│   ├── login.html
│   ├── sales.html
│   ├── stock.html
│   └── reports.html
├── src/
│   ├── controllers/               # İstek işleyicileri
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── sale.controller.js
│   │   └── report.controller.js
│   ├── models/                    # Sequelize modelleri
│   │   ├── index.js
│   │   ├── user.model.js
│   │   ├── store.model.js
│   │   ├── product.model.js
│   │   └── sale.model.js
│   ├── routes/                    # API rotaları
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── sale.routes.js
│   │   └── report.routes.js
│   ├── middleware/                # Özel middleware
│   │   ├── auth.jwt.js
│   │   └── role.middleware.js
│   ├── config/                    # Uygulama yapılandırması
│   │   ├── auth.config.js
│   │   └── db.config.js
│   └── app.js                     # Express uygulaması kurulumu
├── package.json
├── package-lock.json
├── README.md                      # İngilizce dokümantasyon
├── README_TR.md                   # Türkçe dokümantasyon
└── database.sqlite                # SQLite veritabanı dosyası

```

---

## ⚙️ Yapılandırma

### Ortam Değişkenleri
Kök dizinde bir `.env` dosyası oluşturun:

```env
# Sunucu Yapılandırması
PORT=3000
NODE_ENV=development

# JWT Yapılandırması
JWT_SECRET=super-gizli-jwt-anahtariniz-uretimde-degistirin
JWT_EXPIRES_IN=24h

# Veritabanı (SQLite kullanmıyorsanız)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arzen_db
DB_USER=kullanici_adiniz
DB_PASSWORD=sifreniz
DB_DIALECT=postgres

# Dosya Yükleme
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Veritabanı Yapılandırması
`config/config.json` dosyasını düzenleyin:

```json
{
  "development": {
    "username": "root",
    "password": null,
    "database": "arzen_dev",
    "host": "127.0.0.1",
    "dialect": "sqlite",
    "storage": "./database.sqlite"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
```

---

## 🤝 Katkıda Bulunma

Katkılar hoş karşılanır! Lütfen şu adımları izleyin:

1. **Depoyu fork edin**
2. **Özellik dalı oluşturun**
   ```bash
   git checkout -b ozellik/muhtesem-ozellik
   ```
3. **Değişikliklerinizi commit edin**
   ```bash
   git commit -m 'Muhteşem bir özellik ekle'
   ```
4. **Dala push edin**
   ```bash
   git push origin ozellik/muhtesem-ozellik
   ```
5. **Pull Request açın**

### Geliştirme Kılavuzları
- Mevcut kod stilini takip edin
- Anlamlı commit mesajları yazın
- Yeni özellikler için testler ekleyin
- Dokümantasyonu gerektiği gibi güncelleyin
- PR göndermeden önce tüm testlerin geçtiğinden emin olun

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

```
MIT Lisansı

Telif Hakkı (c) 2024 Arzen

İşbu belge ile, bu yazılımın ve ilgili dokümantasyon dosyalarının ("Yazılım")
bir kopyasını edinen herhangi bir kişiye, Yazılımı kullanma, kopyalama,
değiştirme, birleştirme, yayınlama, dağıtma, alt lisanslama ve/veya satma
hakları da dahil olmak üzere, Yazılımda kısıtlama olmaksızın işlem yapma
izni ücretsiz olarak verilir.

Yukarıdaki telif hakkı bildirimi ve bu izin bildirimi, Yazılımın tüm
kopyalarına veya önemli bölümlerine dahil edilecektir.

YAZILIM "OLDUĞU GİBİ" SAĞLANIR, SATILABİLİRLİK, BELİRLİ BİR AMACA UYGUNLUK
VE İHLAL ETMEME GARANTİLERİ DAHİL ANCAK BUNLARLA SINIRLI OLMAMAK ÜZERE,
AÇIK VEYA ZIMNİ HİÇBİR GARANTİ OLMAKSIZIN. HİÇBİR DURUMDA YAZARLAR VEYA
TELİF HAKKI SAHİPLERİ, YAZILIMDAN VEYA YAZILIMIN KULLANIMI VEYA DİĞER
İŞLEMLERİNDEN KAYNAKLANAN HERHANGİ BİR İDDİA, HASAR VEYA DİĞER
YÜKÜMLÜLÜKLERDEN SORUMLU TUTULAMAZ.
```

---

## 💬 Destek

### Yardıma mı İhtiyacınız Var?
- 📧 E-posta: destek@arzen.app
- 💬 Discord: [Topluluğumuza katılın](#)
- 🐛 Sorunlar: [GitHub Issues](https://github.com/kullaniciadi/arzen/issues)
- 📖 Wiki: [Proje Wiki](https://github.com/kullaniciadi/arzen/wiki)

### Sık Sorulan Sorular

**S: Bunu restoranım için kullanabilir miyim?**
C: Kesinlikle! Arzen özellikle restoranlar, kafeler ve benzer işletmeler için tasarlanmıştır.

**S: Barkod okuyucuya ihtiyacım var mı?**
C: Hayır! Arzen barkod kullanmayan işletmeler için yapılmıştır.

**S: Birden fazla mağaza çalıştırabilir miyim?**
C: Evet! Sistem ayrı envanter ve kullanıcılarla birden fazla mağazayı destekler.

**S: Verilerim güvende mi?**
C: Evet! JWT kimlik doğrulama, şifre hashleme ve güvenli HTTP başlıkları dahil endüstri standardı güvenlik uygulamaları kullanıyoruz.

**S: Verilerimi dışa aktarabilir miyim?**
C: Evet! Raporlar CSV, PDF ve Excel formatlarına aktarılabilir.

**S: Mobil uygulama var mı?**
C: Web arayüzü tamamen duyarlıdır ve mobil cihazlarda harika çalışır. Native bir uygulama gelecek için planlanmaktadır.

---

## 🗺️ Yol Haritası

### Versiyon 1.1 (2024 Q2)
- [ ] Müşteri yönetimi
- [ ] Sadakat programı
- [ ] SMS/E-posta bildirimleri
- [ ] Fiş yazdırma

### Versiyon 1.2 (2024 Q3)
- [ ] Mobil uygulama (iOS/Android)
- [ ] Gelişmiş envanter tahmini
- [ ] Tedarikçi yönetimi
- [ ] Satın alma siparişleri

### Versiyon 2.0 (2024 Q4)
- [ ] Çoklu para birimi desteği
- [ ] Bölgeye göre vergi yapılandırması
- [ ] Çalışan zaman takibi
- [ ] Restoranlar için masa yönetimi

---

## 🌟 Teşekkürler

- Muhteşem UI framework için **Bootstrap**
- Güzel görselleştirmeler için **Chart.js**
- Zarif veritabanı yönetimi için **Sequelize**
- Sağlam backend framework için **Express.js**
- İlham ve destek için açık kaynak topluluğu

---

<div align="center">



[⬆ Başa Dön](#-arzen--restoran--stok-yönetim-sistemi)

</div>
