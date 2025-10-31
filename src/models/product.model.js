module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    cost_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    category: {
      type: Sequelize.STRING,
      allowNull: true
    },
    store_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Stores',
        key: 'id'
      }
    }
  });

  Product.associate = models => {
    Product.belongsTo(models.Store, {
      foreignKey: 'store_id',
      as: 'store'
    });
    Product.hasMany(models.Sale, {
      foreignKey: 'product_id',
      as: 'sales'
    });
  };

  return Product;
};
