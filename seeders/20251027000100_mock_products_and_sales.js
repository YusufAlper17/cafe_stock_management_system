'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Create products for store 1 only
    const products = [
      { name: 'Artisan Baguette', image_url: 'images/no-image.svg', cost_price: 1.2, price: 3.5, category: 'Bakery', stock: 50, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Sourdough Bread', image_url: 'images/no-image.svg', cost_price: 1.8, price: 5.0, category: 'Bakery', stock: 30, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Croissant', image_url: 'images/no-image.svg', cost_price: 1.3, price: 3.8, category: 'Bakery', stock: 40, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Espresso', image_url: 'images/no-image.svg', cost_price: 0.8, price: 2.5, category: 'Coffee', stock: 100, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Cappuccino', image_url: 'images/no-image.svg', cost_price: 1.5, price: 4.5, category: 'Coffee', stock: 80, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Latte', image_url: 'images/no-image.svg', cost_price: 1.7, price: 5.0, category: 'Coffee', stock: 60, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Blueberry Muffin', image_url: 'images/no-image.svg', cost_price: 1.2, price: 3.5, category: 'Pastry', stock: 25, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Cheesecake Slice', image_url: 'images/no-image.svg', cost_price: 2.5, price: 6.5, category: 'Dessert', stock: 15, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Turkey Club Sandwich', image_url: 'images/no-image.svg', cost_price: 3.5, price: 8.5, category: 'Sandwich', stock: 20, store_id: 1, createdAt: now, updatedAt: now },
      { name: 'Caesar Salad', image_url: 'images/no-image.svg', cost_price: 2.8, price: 6.8, category: 'Salad', stock: 18, store_id: 1, createdAt: now, updatedAt: now }
    ];

    await queryInterface.bulkInsert('Products', products);

    // Create some sample sales
    const sales = [];
    for (let i = 0; i < 10; i++) {
      const productId = Math.floor(Math.random() * 10) + 1;
      const quantity = Math.floor(Math.random() * 3) + 1;
      const saleDate = new Date(now.getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000)); // Last 7 days
      
      sales.push({
        product_id: productId,
        store_id: 1,
        quantity: quantity,
        price: products[productId - 1].price,
        date: saleDate,
        createdAt: saleDate,
        updatedAt: saleDate
      });
    }

    await queryInterface.bulkInsert('Sales', sales);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Sales', null, {});
    await queryInterface.bulkDelete('Products', null, {});
  }
};