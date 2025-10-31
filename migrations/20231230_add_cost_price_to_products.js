'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'cost_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      after: 'price'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'cost_price');
  }
}; 