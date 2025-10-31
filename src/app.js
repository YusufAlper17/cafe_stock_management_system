require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const path = require('path');
const helmet = require('helmet');

const app = express();

// Basic security headers
app.use(helmet());

// Custom CSP settings
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
      "img-src 'self' data: blob: https:; " +
      "font-src 'self' https://cdn.jsdelivr.net; " +
      "connect-src 'self'"
  );
  next();
});

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/stores', require('./routes/store.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/sales', require('./routes/sales.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/archives', require('./routes/archive.routes'));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Page routes
app.get('/sales', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/sales.html'));
});

app.get('/stock', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/stock.html'));
});

app.get('/reports', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/reports.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

app.get('/archive', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/archive.html'));
});

// Friendly route for login without .html
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

async function initializeApp() {
  try {
    // Sync database
    await db.sequelize.sync();
    console.log('Database synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    process.exit(1);
  }
}

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initializeApp();
}

module.exports = app;
