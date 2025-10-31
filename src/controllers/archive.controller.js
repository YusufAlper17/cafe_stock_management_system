const {
  Sale,
  Product,
  Store,
  MonthlyArchive,
  sequelize
} = require('../models');
const { Op } = require('sequelize');

// Generate and store monthly archive
const generateMonthlyArchive = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const store_id = req.user.store_id;
    const { year, month } = req.body;

    // Validate input
    if (!year || !month || month < 1 || month > 12) {
      return res.status(400).json({
        message: 'Invalid year or month provided!'
      });
    }

    // Check if archive already exists
    const existingArchive = await MonthlyArchive.findOne({
      where: { store_id, year, month }
    });

    if (existingArchive) {
      return res.status(400).json({
        message: 'Archive already exists for this month!'
      });
    }

    // Calculate start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get all sales for the month
    const sales = await Sale.findAll({
      where: {
        store_id,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: Product,
          attributes: ['name', 'cost_price']
        }
      ],
      transaction
    });

    // Calculate totals
    const totalSales = sales.reduce(
      (sum, sale) => sum + sale.price * sale.quantity,
      0
    );
    const totalProfit = sales.reduce((sum, sale) => {
      const profit = (sale.price - sale.Product.cost_price) * sale.quantity;
      return sum + profit;
    }, 0);

    // Calculate top products
    const productSales = {};
    sales.forEach(sale => {
      const productName = sale.Product.name;
      if (!productSales[productName]) {
        productSales[productName] = {
          quantity: 0,
          revenue: 0,
          profit: 0
        };
      }
      productSales[productName].quantity += sale.quantity;
      productSales[productName].revenue += sale.price * sale.quantity;
      productSales[productName].profit +=
        (sale.price - sale.Product.cost_price) * sale.quantity;
    });

    const topProducts = Object.entries(productSales)
      .map(([name, stats]) => ({
        product_name: name,
        ...stats
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Create archive record
    const archive = await MonthlyArchive.create(
      {
        store_id,
        year,
        month,
        total_sales: totalSales,
        total_profit: totalProfit,
        total_transactions: sales.length,
        top_products: topProducts,
        archived_at: new Date()
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: 'Monthly archive generated successfully!',
      archive
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      message: 'Error generating monthly archive!',
      error: error.message
    });
  }
};

// Get monthly archives
const getMonthlyArchives = async (req, res) => {
  try {
    const store_id = req.user.store_id;
    const { year } = req.query;

    const whereClause = { store_id };
    if (year) {
      whereClause.year = year;
    }

    const archives = await MonthlyArchive.findAll({
      where: whereClause,
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_name']
        }
      ],
      order: [
        ['year', 'DESC'],
        ['month', 'DESC']
      ]
    });

    res.json({
      message: 'Monthly archives retrieved successfully!',
      archives
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving monthly archives!',
      error: error.message
    });
  }
};

// Get specific monthly archive
const getMonthlyArchive = async (req, res) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const archive = await MonthlyArchive.findOne({
      where: { id, store_id },
      include: [
        {
          model: Store,
          as: 'store',
          attributes: ['store_name']
        }
      ]
    });

    if (!archive) {
      return res.status(404).json({
        message: 'Archive not found or unauthorized!'
      });
    }

    res.json({
      message: 'Monthly archive retrieved successfully!',
      archive
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving monthly archive!',
      error: error.message
    });
  }
};

module.exports = {
  generateMonthlyArchive,
  getMonthlyArchives,
  getMonthlyArchive
};
