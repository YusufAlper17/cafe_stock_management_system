module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define('Store', {
    store_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  Store.associate = models => {
    Store.hasMany(models.Product, {
      foreignKey: 'store_id',
      as: 'products'
    });
    Store.hasMany(models.Sale, {
      foreignKey: 'store_id',
      as: 'sales'
    });
    Store.hasMany(models.User, {
      foreignKey: 'store_id',
      as: 'users'
    });
  };

  return Store;
};
