'use strict';

const {
  MOCK_PRODUCTS,
  buildMockSales
} = require('../src/data/mockCatalog');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    const products = MOCK_PRODUCTS.map(product => ({
      ...product,
      store_id: 1,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('Products', products);

    const catalogProducts = products.map((product, index) => ({
      id: index + 1,
      ...product
    }));

    const sales = buildMockSales(catalogProducts, 1).map(sale => ({
      ...sale,
      createdAt: sale.date,
      updatedAt: sale.date
    }));

    await queryInterface.bulkInsert('Sales', sales);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Sales', null, {});
    await queryInterface.bulkDelete('Products', null, {});
  }
};
