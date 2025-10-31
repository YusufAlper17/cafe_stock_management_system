# 🏪 Arzen — Restaurant & Stock Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A modern, full-featured Point of Sale (POS) and inventory management system designed for restaurants, cafés, and small businesses that sell products without barcodes.

[Features](#-features) • [Demo](#-demo-credentials) • [Installation](#-installation) • [Documentation](#-documentation) • [Tech Stack](#-tech-stack)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🎯 Overview

**Arzen** is a comprehensive, web-based stock and sales management system built specifically for small to medium-sized businesses like bakeries, cafés, and restaurants that don't use barcode scanners. The system provides:

- **Real-time inventory tracking** with automatic stock updates
- **Modern POS interface** for quick and efficient sales
- **Advanced analytics** with beautiful charts and insights
- **Multi-store support** for businesses with multiple locations
- **Internationalization** with English and Turkish language support
- **Dark mode** for comfortable use in any lighting condition

Perfect for daily operations: add your products in the morning, sell throughout the day, track your cash flow, and generate comprehensive reports.

---

## ✨ Features

### 🛍️ Sales Management (POS)
- **Intuitive product grid** with search and filtering
- **Shopping cart** with real-time calculations
- **Quick quantity adjustments** with +/- buttons
- **Automatic stock deduction** upon sale completion
- **VAT calculation** (18% default, configurable)
- **Transaction history** with detailed records

### 📦 Inventory Management
- **Complete CRUD operations** for products
- **Image upload** with preview for each product
- **Cost and sale price** tracking
- **Stock level monitoring** with low-stock alerts
- **Category-based organization**
- **Bulk operations** support

### 📊 Reports & Analytics
- **Comprehensive dashboard** with key metrics
- **Interactive charts** (Chart.js powered)
  - Daily sales trends
  - Top-selling products
  - Revenue vs. profit comparison
- **Customizable date ranges** with quick filters
- **Detailed sale breakdowns**
- **Export capabilities** (CSV, PDF, Excel)
- **Key Performance Indicators**:
  - Total sales and profit
  - Average basket size
  - Transaction count
  - Product performance

### 🏢 Multi-Store Support
- **Independent data** for each location
- **Store-specific inventory** and sales
- **Centralized user management**
- **Role-based access control**

### 🌍 Internationalization (i18n)
- **English** and **Turkish** language support
- **Easy language switching** from any page
- **Persistent language preference**
- **Fully translated UI** including error messages

### 🎨 Modern UI/UX
- **Responsive design** that works on desktop, tablet, and mobile
- **Dark mode** with smooth transitions
- **Bootstrap 5** for consistent styling
- **Intuitive navigation** with sidebar menu
- **Toast notifications** for user feedback
- **Modal dialogs** for confirmations

### 🔐 Security
- **JWT authentication** for secure sessions
- **Role-based authorization** (Admin, Staff)
- **Password hashing** with bcryptjs
- **Protected API routes**
- **Helmet.js** for HTTP header security
- **CORS** configuration

---

## 📸 Screenshots

### Login Page
Modern login interface with theme and language selection
```
📱 Features:
- Clean, centered design
- Theme toggle (Light/Dark)
- Language selector (EN/TR)
- Remember me option
```

### Sales (POS) Interface
Efficient point-of-sale with product grid and shopping cart
```
🛒 Features:
- Product search and sort
- Visual product cards with images
- Quick add to cart
- Real-time cart summary
- Stock level indicators
```

### Stock Management
Complete inventory control with easy CRUD operations
```
📦 Features:
- Product list with images
- Add/Edit/Delete products
- Image upload with preview
- Cost and sale price tracking
- Category management
```

### Reports & Analytics
Comprehensive insights with interactive visualizations
```
📈 Features:
- Daily/Weekly/Monthly views
- Sales trend charts
- Top products analysis
- Profit tracking
- Export functionality
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: SQLite (default), PostgreSQL, MySQL supported
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet.js, bcryptjs, CORS

### Frontend
- **HTML5** / **CSS3** / **Vanilla JavaScript**
- **UI Framework**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Charts**: Chart.js
- **HTTP**: Fetch API

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Process Manager**: nodemon (dev)
- **Database Migrations**: Sequelize CLI
- **Code Quality**: ESLint (optional)

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/arzen.git
cd arzen
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Database
Edit `config/config.json` for your database settings. By default, it uses SQLite:

```json
{
  "development": {
    "dialect": "sqlite",
    "storage": "./database.sqlite"
  }
}
```

For PostgreSQL or MySQL, update accordingly:
```json
{
  "development": {
    "username": "your_username",
    "password": "your_password",
    "database": "arzen_db",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

### Step 4: Run Migrations
```bash
npx sequelize-cli db:migrate
```

### Step 5: Seed Database (Optional)
Populate with demo data including stores, users, products, and sales:
```bash
npx sequelize-cli db:seed:all
```

### Step 6: Start the Application
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

The application will be available at `http://localhost:3000`

---

## 📖 Usage

### Demo Credentials
After seeding, use these credentials to log in:

| Username | Password | Role | Store |
|----------|----------|------|-------|
| admin1 | password123 | Admin | Store 1 |
| admin2 | password123 | Admin | Store 2 |
| staff1 | password123 | Staff | Store 1 |

### Quick Start Guide

1. **Login**: Use demo credentials or create your own user
2. **Add Products**: Navigate to Stock Management and add your products with images and prices
3. **Make Sales**: Go to Sales page, add products to cart, and complete transactions
4. **View Reports**: Check Reports page for analytics and insights
5. **Manage**: Edit products, adjust stock levels, and export data as needed

### Workflow for Daily Operations

**Morning Setup:**
1. Log in to the system
2. Review current stock levels
3. Add new products for the day
4. Update prices if needed

**During Business Hours:**
1. Use the POS interface for quick sales
2. Stock automatically updates
3. Monitor sales in real-time

**End of Day:**
1. Generate daily sales report
2. Review profit and revenue
3. Check low-stock items
4. Plan for next day

---

## 📡 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin1",
  "password": "password123"
}
```

Response:
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

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

### Products

#### Get All Products
```http
GET /api/products
Authorization: Bearer {token}
```

#### Create Product
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "Croissant",
  "stock": 50,
  "cost_price": 1.5,
  "price": 3.5,
  "category": "Bakery",
  "image": [file]
}
```

#### Update Product
```http
PUT /api/products/:id
Authorization: Bearer {token}
```

#### Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer {token}
```

### Sales

#### Complete Sale
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

#### Get Sales History
```http
GET /api/sales/history?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

### Reports

#### Get Analytics
```http
GET /api/reports/analytics?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

---

## 📁 Project Structure

```
arzen/
├── config/
│   └── config.json                 # Database configuration
├── migrations/                      # Database migrations
│   ├── 20231220_create_stores.js
│   ├── 20231220_create_users.js
│   └── 20231220_create_products.js
├── seeders/                        # Database seeders
│   └── 20251027000100_mock_products_and_sales.js
├── public/                         # Frontend assets
│   ├── css/
│   │   ├── style.css              # Main styles
│   │   ├── login.css              # Login page styles
│   │   ├── sales.css              # Sales page styles
│   │   └── reports.css            # Reports page styles
│   ├── js/
│   │   ├── auth.js                # Authentication & i18n
│   │   ├── sales.js               # Sales/POS logic
│   │   ├── stock.js               # Stock management
│   │   └── reports.js             # Reports & analytics
│   ├── uploads/                   # Uploaded product images
│   ├── login.html
│   ├── sales.html
│   ├── stock.html
│   └── reports.html
├── src/
│   ├── controllers/               # Request handlers
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── sale.controller.js
│   │   └── report.controller.js
│   ├── models/                    # Sequelize models
│   │   ├── index.js
│   │   ├── user.model.js
│   │   ├── store.model.js
│   │   ├── product.model.js
│   │   └── sale.model.js
│   ├── routes/                    # API routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── sale.routes.js
│   │   └── report.routes.js
│   ├── middleware/                # Custom middleware
│   │   ├── auth.jwt.js
│   │   └── role.middleware.js
│   ├── config/                    # App configuration
│   │   ├── auth.config.js
│   │   └── db.config.js
│   └── app.js                     # Express app setup
├── package.json
├── package-lock.json
├── README.md                      # English documentation
├── README_TR.md                   # Turkish documentation
└── database.sqlite                # SQLite database file

```

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Database (if not using SQLite)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=arzen_db
DB_USER=your_username
DB_PASSWORD=your_password
DB_DIALECT=postgres

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
```

### Database Configuration
Edit `config/config.json`:

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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Arzen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 💬 Support

### Need Help?
- 📧 Email: support@arzen.app
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/arzen/issues)
- 📖 Wiki: [Project Wiki](https://github.com/yourusername/arzen/wiki)

### Frequently Asked Questions

**Q: Can I use this for my restaurant?**
A: Absolutely! Arzen is designed specifically for restaurants, cafés, and similar businesses.

**Q: Do I need a barcode scanner?**
A: No! Arzen is built for businesses that don't use barcodes.

**Q: Can I run multiple stores?**
A: Yes! The system supports multiple stores with separate inventories and users.

**Q: Is my data secure?**
A: Yes! We use industry-standard security practices including JWT authentication, password hashing, and secure HTTP headers.

**Q: Can I export my data?**
A: Yes! Reports can be exported to CSV, PDF, and Excel formats.

**Q: Is there a mobile app?**
A: The web interface is fully responsive and works great on mobile devices. A native app is planned for the future.

---

## 🗺️ Roadmap

### Version 1.1 (Q2 2024)
- [ ] Customer management
- [ ] Loyalty program
- [ ] SMS/Email notifications
- [ ] Receipt printing

### Version 1.2 (Q3 2024)
- [ ] Mobile app (iOS/Android)
- [ ] Advanced inventory forecasting
- [ ] Supplier management
- [ ] Purchase orders

### Version 2.0 (Q4 2024)
- [ ] Multi-currency support
- [ ] Tax configuration per region
- [ ] Employee time tracking
- [ ] Table management for restaurants

---

## 🌟 Acknowledgments

- **Bootstrap** for the amazing UI framework
- **Chart.js** for beautiful visualizations
- **Sequelize** for elegant database management
- **Express.js** for the robust backend framework
- The open-source community for inspiration and support

---

<div align="center">



[⬆ Back to Top](#-arzen--restaurant--stock-management-system)

</div>
