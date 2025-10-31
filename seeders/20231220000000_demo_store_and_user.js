'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    // Create demo stores
    await queryInterface.bulkInsert('Stores', [
      {
        store_name: 'Central Bakery',
        address: '123 Main St, City',
        phone: '1234567890',
        createdAt: now,
        updatedAt: now
      },
      {
        store_name: 'Downtown Cafe',
        address: '456 Elm St, City',
        phone: '0987654321',
        createdAt: now,
        updatedAt: now
      },
      {
        store_name: 'Uptown Restaurant',
        address: '789 Oak St, City',
        phone: '1122334455',
        createdAt: now,
        updatedAt: now
      }
    ]);

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 8);
    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin1',
        password: hashedPassword,
        role: 'admin',
        store_id: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'staff1',
        password: hashedPassword,
        role: 'staff',
        store_id: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'admin2',
        password: hashedPassword,
        role: 'admin',
        store_id: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'staff2',
        password: hashedPassword,
        role: 'staff',
        store_id: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'admin3',
        password: hashedPassword,
        role: 'admin',
        store_id: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'staff3',
        password: hashedPassword,
        role: 'staff',
        store_id: 3,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Stores', null, {});
  }
};