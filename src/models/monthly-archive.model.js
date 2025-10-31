const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const MonthlyArchive = sequelize.define(
    'MonthlyArchive',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 12
        }
      },
      total_sales: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_profit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_transactions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      top_products: {
        type: DataTypes.JSON,
        allowNull: true
      },
      archived_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true,
      tableName: 'monthly_archives',
      indexes: [
        {
          unique: true,
          fields: ['store_id', 'year', 'month']
        }
      ]
    }
  );

  return MonthlyArchive;
};
