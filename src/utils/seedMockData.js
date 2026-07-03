const bcrypt = require('bcryptjs');
const db = require('../models');

const { Store, User, Product, Sale, sequelize } = db;

const MOCK_PRODUCTS = [
  { name: 'Artisan Baguette', cost_price: 1.2, price: 3.5, category: 'Bakery', stock: 50 },
  { name: 'Sourdough Bread', cost_price: 1.8, price: 5.0, category: 'Bakery', stock: 30 },
  { name: 'Croissant', cost_price: 1.3, price: 3.8, category: 'Bakery', stock: 40 },
  { name: 'Espresso', cost_price: 0.8, price: 2.5, category: 'Coffee', stock: 100 },
  { name: 'Cappuccino', cost_price: 1.5, price: 4.5, category: 'Coffee', stock: 80 },
  { name: 'Latte', cost_price: 1.7, price: 5.0, category: 'Coffee', stock: 60 },
  { name: 'Blueberry Muffin', cost_price: 1.2, price: 3.5, category: 'Pastry', stock: 25 },
  { name: 'Cheesecake Slice', cost_price: 2.5, price: 6.5, category: 'Dessert', stock: 15 },
  { name: 'Turkey Club Sandwich', cost_price: 3.5, price: 8.5, category: 'Sandwich', stock: 20 },
  { name: 'Caesar Salad', cost_price: 2.8, price: 6.8, category: 'Salad', stock: 18 }
];

async function seedMockDataIfNeeded() {
  const productCount = await Product.count();
  if (productCount > 0) {
    return;
  }

  await sequelize.transaction(async transaction => {
    await Sale.destroy({ where: {}, transaction });
    await Product.destroy({ where: {}, transaction });
    await User.destroy({ where: {}, transaction });
    await Store.destroy({ where: {}, transaction });

    const stores = await Store.bulkCreate(
      [
        { store_name: 'Central Bakery', address: '123 Main St, City', phone: '1234567890' },
        { store_name: 'Downtown Cafe', address: '456 Elm St, City', phone: '0987654321' },
        { store_name: 'Uptown Restaurant', address: '789 Oak St, City', phone: '1122334455' }
      ],
      { transaction }
    );

    const hashedPassword = await bcrypt.hash('password123', 8);
    await User.bulkCreate(
      [
        { username: 'admin1', password: hashedPassword, role: 'admin', store_id: stores[0].id },
        { username: 'staff1', password: hashedPassword, role: 'cashier', store_id: stores[0].id },
        { username: 'admin2', password: hashedPassword, role: 'admin', store_id: stores[1].id },
        { username: 'staff2', password: hashedPassword, role: 'cashier', store_id: stores[1].id },
        { username: 'admin3', password: hashedPassword, role: 'admin', store_id: stores[2].id },
        { username: 'staff3', password: hashedPassword, role: 'cashier', store_id: stores[2].id }
      ],
      { transaction }
    );

    const products = await Product.bulkCreate(
      MOCK_PRODUCTS.map(product => ({ ...product, store_id: stores[0].id })),
      { transaction }
    );

    const now = Date.now();
    const sales = products.slice(0, 10).map((product, index) => {
      const quantity = (index % 3) + 1;
      const saleDate = new Date(now - index * 24 * 60 * 60 * 1000);

      return {
        product_id: product.id,
        store_id: stores[0].id,
        quantity,
        price: product.price,
        date: saleDate
      };
    });

    await Sale.bulkCreate(sales, { transaction });
  });

  console.log('Mock data seeded successfully.');
}

module.exports = { seedMockDataIfNeeded };
