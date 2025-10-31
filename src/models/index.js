const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config);
}

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
db.Store = require('./store.model')(sequelize, Sequelize);
db.Product = require('./product.model')(sequelize, Sequelize);
db.Sale = require('./sale.model')(sequelize, Sequelize);
db.MonthlyArchive = require('./monthly-archive.model')(sequelize, Sequelize);

// Define associations
db.User.belongsTo(db.Store, {
  foreignKey: 'store_id',
  as: 'store'
});

db.Store.hasMany(db.User, {
  foreignKey: 'store_id',
  as: 'users'
});

db.Product.belongsTo(db.Store, {
  foreignKey: 'store_id',
  as: 'store'
});

db.Store.hasMany(db.Product, {
  foreignKey: 'store_id',
  as: 'products'
});

// Sale associations
db.Sale.belongsTo(db.Product, {
  foreignKey: 'product_id'
});

db.Sale.belongsTo(db.Store, {
  foreignKey: 'store_id'
});

db.Product.hasMany(db.Sale, {
  foreignKey: 'product_id'
});

db.Store.hasMany(db.Sale, {
  foreignKey: 'store_id'
});

// MonthlyArchive associations
db.MonthlyArchive.belongsTo(db.Store, {
  foreignKey: 'store_id',
  as: 'store'
});

db.Store.hasMany(db.MonthlyArchive, {
  foreignKey: 'store_id',
  as: 'monthlyArchives'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
