const db = require('../models');
const { Op } = require('sequelize');
const Sale = db.Sale;
const Product = db.Product;
const Archive = db.Archive;

// Helper function to calculate report
const calculateReport = sales => {
  let totalRevenue = 0;
  let totalCost = 0;
  let totalQuantity = 0;

  sales.forEach(sale => {
    totalRevenue += sale.price * sale.quantity;
    totalCost += sale.Product.cost_price * sale.quantity;
    totalQuantity += sale.quantity;
  });

  return {
    total_sales: sales.length,
    total_revenue: totalRevenue,
    total_profit: totalRevenue - totalCost,
    total_quantity: totalQuantity,
    sales: sales
  };
};

// Analytics with date range
exports.getAnalytics = async (req, res) => {
  try {
    const storeId = req.user.store_id;
    let { startDate, endDate } = req.query;

    // Default: today
    const today = new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const end = endDate
      ? new Date(endDate)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Normalize range end exclusive +1 day
    const rangeStart = new Date(start);
    rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd = new Date(end);
    rangeEnd.setHours(23, 59, 59, 999);

    const sales = await Sale.findAll({
      where: {
        store_id: storeId,
        date: { [Op.gte]: rangeStart, [Op.lte]: rangeEnd }
      },
      include: [{ model: Product, attributes: ['name', 'cost_price'] }],
      order: [['date', 'ASC']]
    });

    // Build summary and series
    const summary = {
      total_sales: 0,
      total_profit: 0,
      total_quantity: 0,
      total_transactions: sales.length,
      average_basket: 0,
      average_quantity: 0,
      average_profit: 0
    };

    const dailyMap = new Map();
    const hourlyMap = new Map(); // 0-23
    const productMap = new Map();

    for (const sale of sales) {
      const price = Number(sale.price) || 0;
      const qty = Number(sale.quantity) || 0;
      const cost = Number(sale.Product?.cost_price) || 0;
      const total = price * qty;
      const profit = (price - cost) * qty;

      summary.total_sales += total;
      summary.total_profit += profit;
      summary.total_quantity += qty;

      const d = new Date(sale.date);
      const dKey = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        .toISOString()
        .split('T')[0];
      const hKey = d.getHours();

      // daily
      const dVal = dailyMap.get(dKey) || { total: 0, profit: 0, count: 0 };
      dVal.total += total;
      dVal.profit += profit;
      dVal.count += 1;
      dailyMap.set(dKey, dVal);

      // hourly
      const hVal = hourlyMap.get(hKey) || { total: 0, profit: 0, count: 0 };
      hVal.total += total;
      hVal.profit += profit;
      hVal.count += 1;
      hourlyMap.set(hKey, hVal);

      // product
      const pName = sale.Product?.name || 'Unknown Product';
      const pVal = productMap.get(pName) || {
        total_revenue: 0,
        total_quantity: 0
      };
      pVal.total_revenue += total;
      pVal.total_quantity += qty;
      productMap.set(pName, pVal);
    }

    if (summary.total_transactions > 0) {
      summary.average_basket = summary.total_sales / summary.total_transactions;
      summary.average_quantity =
        summary.total_quantity / summary.total_transactions;
      summary.average_profit =
        summary.total_profit / summary.total_transactions;
    }

    const series = {
      daily: Array.from(dailyMap.entries())
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([date, v]) => ({
          date,
          total: v.total,
          profit: v.profit,
          count: v.count
        })),
      hourly: Array.from({ length: 24 }, (_, h) => {
        const v = hourlyMap.get(h) || { total: 0, profit: 0, count: 0 };
        return { hour: h, total: v.total, profit: v.profit, count: v.count };
      })
    };

    const top_products = Array.from(productMap.entries())
      .map(([name, v]) => ({
        name,
        total_revenue: v.total_revenue,
        total_quantity: v.total_quantity
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 10);

    return res.json({ success: true, summary, series, top_products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error generating analytics',
      error: error.message
    });
  }
};

// Daily report
exports.getDailyReport = async (req, res) => {
  try {
    const storeId = req.user.store_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sale.findAll({
      where: {
        store_id: storeId,
        date: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      },
      include: [{ model: Product, attributes: ['name', 'cost_price'] }]
    });

    res.json(calculateReport(sales));
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error generating daily report', error: error.message });
  }
};

// Weekly report
exports.getWeeklyReport = async (req, res) => {
  try {
    const storeId = req.user.store_id;
    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(firstDay);
    lastDay.setDate(lastDay.getDate() + 7);

    const sales = await Sale.findAll({
      where: {
        store_id: storeId,
        date: {
          [Op.gte]: firstDay,
          [Op.lt]: lastDay
        }
      },
      include: [{ model: Product, attributes: ['name', 'cost_price'] }]
    });

    res.json(calculateReport(sales));
  } catch (error) {
    res.status(500).json({
      message: 'Error generating weekly report',
      error: error.message
    });
  }
};

// Monthly report
exports.getMonthlyReport = async (req, res) => {
  try {
    const storeId = req.user.store_id;
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const sales = await Sale.findAll({
      where: {
        store_id: storeId,
        date: {
          [Op.gte]: firstDay,
          [Op.lt]: lastDay
        }
      },
      include: [{ model: Product, attributes: ['name', 'cost_price'] }]
    });

    res.json(calculateReport(sales));
  } catch (error) {
    res.status(500).json({
      message: 'Error generating monthly report',
      error: error.message
    });
  }
};

// Archives
exports.getArchives = async (req, res) => {
  try {
    const storeId = req.user.store_id;
    const archives = await Archive.findAll({
      where: { store_id: storeId },
      order: [['month', 'DESC']]
    });
    res.json(archives);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error loading archives', error: error.message });
  }
};

module.exports = {
  getDailyReport: exports.getDailyReport,
  getWeeklyReport: exports.getWeeklyReport,
  getMonthlyReport: exports.getMonthlyReport,
  getArchives: exports.getArchives,
  getAnalytics: exports.getAnalytics
};
