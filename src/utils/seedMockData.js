const bcrypt = require('bcryptjs');
const db = require('../models');
const {
  MOCK_STORES,
  MOCK_USERS,
  MOCK_PRODUCTS,
  buildMockSales,
  isPlaceholderImage
} = require('../data/mockCatalog');

const { Store, User, Product, Sale, sequelize } = db;

async function syncMockProductImages() {
  const products = await Product.findAll();

  for (const product of products) {
    const catalogItem = MOCK_PRODUCTS.find(item => item.name === product.name);
    if (!catalogItem) {
      continue;
    }

    if (isPlaceholderImage(product.image_url)) {
      await product.update({ image_url: catalogItem.image_url });
    }
  }
}

async function seedMockDataIfNeeded() {
  const productCount = await Product.count();

  if (productCount > 0) {
    await syncMockProductImages();
    return;
  }

  await sequelize.transaction(async transaction => {
    await Sale.destroy({ where: {}, transaction });
    await Product.destroy({ where: {}, transaction });
    await User.destroy({ where: {}, transaction });
    await Store.destroy({ where: {}, transaction });

    const stores = await Store.bulkCreate(MOCK_STORES, { transaction });

    const hashedPassword = await bcrypt.hash('password123', 8);
    await User.bulkCreate(
      MOCK_USERS.map(user => ({
        username: user.username,
        password: hashedPassword,
        role: user.role,
        store_id: stores[user.storeIndex].id
      })),
      { transaction }
    );

    const products = await Product.bulkCreate(
      MOCK_PRODUCTS.map(product => ({
        ...product,
        store_id: stores[0].id
      })),
      { transaction }
    );

    const sales = buildMockSales(products, stores[0].id);
    await Sale.bulkCreate(sales, { transaction });
  });

  console.log('Mock data seeded successfully.');
}

module.exports = { seedMockDataIfNeeded, syncMockProductImages };
