module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Sales', 'sale_price', 'price');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Sales', 'price', 'sale_price');
  }
};
