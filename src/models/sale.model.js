module.exports = (sequelize, Sequelize) => {
  const Sale = sequelize.define('Sale', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    store_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Stores',
        key: 'id'
      }
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  });

  Sale.associate = models => {
    Sale.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
    Sale.belongsTo(models.Store, {
      foreignKey: 'store_id',
      as: 'store'
    });
  };

  return Sale;
};
