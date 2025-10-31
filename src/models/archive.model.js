module.exports = (sequelize, Sequelize) => {
  const Archive = sequelize.define(
    'Archive',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      period: {
        type: Sequelize.STRING,
        allowNull: false
      },
      total_sales: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      total_revenue: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      data: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {}
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return Archive;
};
