'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'store_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Stores',
        key: 'id'
      },
      after: 'role'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'store_id');
  }
};
