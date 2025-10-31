const { Sale, Product, Store, sequelize } = require('../models');
const { Op } = require('sequelize');

// Helper function to get Turkish local time
function getTurkishTime(date = new Date()) {
  return new Date(
    date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' })
  );
}

// Helper function to format date for SQLite
function formatDateForSQLite(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Helper function to get start of day in Turkish time
function getStartOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  // Convert to UTC
  return new Date(d.getTime() - 3 * 60 * 60 * 1000);
}

// Helper function to get end of day in Turkish time
function getEndOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  // Convert to UTC
  return new Date(d.getTime() - 3 * 60 * 60 * 1000);
}

// Complete a sale with cart items
const completeSale = async (req, res) => {
  // Start a transaction to ensure data consistency
  const transaction = await sequelize.transaction();

  try {
    const { items } = req.body;
    const store_id = req.user.store_id;

    console.log('Starting sale completion:', { items, store_id });

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('Invalid items in request:', items);
      return res.status(400).json({
        success: false,
        message: 'Cart cannot be empty.'
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.price) {
        console.error('Invalid item data:', item);
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Invalid product information.'
        });
      }
    }

    const sales = [];
    const productUpdates = [];

    // Get current date in Turkish time
    const saleDate = getTurkishTime();
    console.log('Sale date:', {
      date: saleDate,
      isoString: saleDate.toISOString(),
      localString: saleDate.toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul'
      })
    });

    // Process each cart item
    for (const item of items) {
      const { product_id, quantity, price } = item;

      const product = await Product.findOne({
        where: { id: product_id, store_id },
        transaction
      });

      if (!product) {
        console.error('Product not found:', product_id);
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: 'Product not found.'
        });
      }

      if (product.stock < quantity) {
        console.error('Insufficient stock:', {
          required: quantity,
          available: product.stock
        });
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`
        });
      }

      // Create sale record with Turkish time
      const sale = await Sale.create(
        {
          product_id,
          store_id,
          quantity,
          price,
          date: saleDate
        },
        { transaction }
      );

      console.log('Sale record created:', {
        ...sale.get({ plain: true }),
        dateFormatted: new Date(sale.date).toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul'
        })
      });

      sales.push(sale);

      // Update product stock
      const newStock = product.stock - quantity;
      await product.update({ stock: newStock }, { transaction });

      productUpdates.push({
        product_id,
        name: product.name,
        old_stock: product.stock,
        new_stock: newStock,
        quantity_sold: quantity
      });
    }

    // Commit transaction
    await transaction.commit();
    console.log('Transaction committed successfully');

    // Send success response
    return res.status(201).json({
      success: true,
      message: 'Sale completed successfully.',
      data: {
        sales: sales.map(sale => ({
          ...sale.get({ plain: true }),
          dateFormatted: new Date(sale.date).toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          })
        })),
        stock_updates: productUpdates
      }
    });
  } catch (error) {
    // Rollback transaction on error
    if (transaction) await transaction.rollback();

    console.error('Sale completion error:', error);

    return res.status(500).json({
      success: false,
      message: 'An error occurred while completing the sale.',
      error: error.message
    });
  }
};

// Get sales history with Turkish time handling
const getSalesHistory = async (req, res) => {
  try {
    const store_id = req.user?.store_id;

    // Store ID kontrolü
    if (!store_id) {
      console.error('Store ID not found:', { user: req.user });
      return res.status(400).json({
        success: false,
        message: 'Store information is missing.'
      });
    }

    let { startDate, endDate } = req.query;

    // Debug için gelen parametreleri logla
    console.log('Incoming parameters:', {
      store_id,
      user: req.user,
      startDate,
      endDate,
      parsed: {
        start: startDate ? new Date(startDate) : null,
        end: endDate ? new Date(endDate) : null
      },
      currentTime: getTurkishTime().toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul'
      })
    });

    // If only startDate is provided, use it as endDate too
    if (startDate && !endDate) {
      endDate = startDate;
    }

    const whereClause = { store_id };

    if (startDate && endDate) {
      try {
        // Türkiye saatine göre gün başlangıcı ve bitişi
        const startDateTime = getStartOfDay(startDate);
        const endDateTime = getEndOfDay(endDate);

        console.log('Date range:', {
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          startLocal: startDateTime.toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          }),
          endLocal: endDateTime.toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          })
        });

        // Tarih karşılaştırması için UTC değerleri kullan
        whereClause.date = {
          [Op.gte]: startDateTime,
          [Op.lte]: endDateTime
        };
      } catch (dateError) {
        console.error('Date parsing error:', dateError);
        return res.status(400).json({
          success: false,
          message: 'Invalid date format.'
        });
      }
    }

    // Log the query conditions
    console.log('Query conditions:', JSON.stringify(whereClause, null, 2));

    // Get sales with product information
    const sales = await Sale.findAll({
      where: whereClause,
      include: [
        {
          model: Product,
          attributes: ['name', 'cost_price']
        }
      ],
      order: [['date', 'DESC']]
    });

    console.log(`${sales.length} sales found`);

    // Log raw sales data for debugging
    console.log(
      'Raw sales data:',
      sales.map(sale => {
        const plainSale = sale.get({ plain: true });
        return {
          id: plainSale.id,
          date: plainSale.date,
          localDate: new Date(plainSale.date).toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          }),
          quantity: plainSale.quantity,
          price: plainSale.price,
          product: plainSale.Product,
          store_id: plainSale.store_id
        };
      })
    );

    if (sales.length === 0) {
      console.log('No sales found:', {
        store_id,
        startDate,
        endDate,
        whereClause
      });
    }

    // Format sales data with improved calculations
    const formattedSales = sales.map(sale => {
      const saleData = sale.get({ plain: true });
      console.log('Processing sale:', saleData);

      const quantity = Number(saleData.quantity) || 0;
      const price = Number(saleData.price) || 0;
      const costPrice = Number(saleData.Product?.cost_price) || 0;

      const formattedSale = {
        id: saleData.id,
        date: saleData.date,
        localDate: new Date(saleData.date).toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul'
        }),
        quantity: quantity,
        price: price,
        total: quantity * price,
        profit: (price - costPrice) * quantity,
        items: [
          {
            product_name: saleData.Product?.name || 'Bilinmeyen Ürün',
            quantity: quantity,
            price: price
          }
        ]
      };

      console.log('Formatted sale:', formattedSale);
      return formattedSale;
    });

    // Calculate improved summary with transaction counts and average basket
    const summary = formattedSales.reduce(
      (acc, sale) => {
        acc.total_sales += Number(sale.total) || 0;
        acc.total_profit += Number(sale.profit) || 0;
        acc.total_quantity += Number(sale.quantity) || 0;
        acc.total_transactions += 1;
        return acc;
      },
      {
        total_sales: 0,
        total_profit: 0,
        total_quantity: 0,
        total_transactions: 0
      }
    );

    // Calculate average basket size and transaction values
    const averages = {
      average_basket:
        summary.total_transactions > 0
          ? summary.total_sales / summary.total_transactions
          : 0,
      average_quantity:
        summary.total_transactions > 0
          ? summary.total_quantity / summary.total_transactions
          : 0,
      average_profit:
        summary.total_transactions > 0
          ? summary.total_profit / summary.total_transactions
          : 0
    };

    console.log('Sales summary:', {
      ...summary,
      ...averages,
      date_range: {
        start: startDate,
        end: endDate
      }
    });

    const response = {
      success: true,
      message:
        formattedSales.length > 0
          ? 'Sales history retrieved successfully.'
          : 'No sales data found for the selected date range.',
      sales: formattedSales,
      summary: {
        ...summary,
        ...averages
      }
    };

    console.log('Sending response, sales count:', formattedSales.length);

    res.json(response);
  } catch (error) {
    console.error('getSalesHistory error:', error);
    console.error('Error details:', error.stack);
    res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving sales history.',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get sale details with Turkish time
const getSaleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const store_id = req.user.store_id;

    const sale = await Sale.findOne({
      where: { id, store_id },
      include: [
        {
          model: Product,
          attributes: ['name', 'cost_price']
        },
        {
          model: Store,
          attributes: ['store_name']
        }
      ]
    });

    if (!sale) {
      return res.status(404).json({
        message: 'Satış bulunamadı!'
      });
    }

    const profit = (sale.price - sale.Product.cost_price) * sale.quantity;
    const saleData = sale.toJSON();

    res.json({
      message: 'Satış detayları başarıyla getirildi!',
      sale: {
        ...saleData,
        date: new Date(saleData.date).toLocaleString('tr-TR', {
          timeZone: 'Europe/Istanbul'
        }),
        profit
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Satış detayları getirilirken hata oluştu!',
      error: error.message
    });
  }
};

module.exports = {
  completeSale,
  getSalesHistory,
  getSaleDetails
};
