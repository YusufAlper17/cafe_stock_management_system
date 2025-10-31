const db = require('../models');
const Sale = db.Sale;

exports.createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({
      message: 'Error creating sale!',
      error: error.message
    });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (error) {
    res.status(500).json({
      message: 'Error listing sales!',
      error: error.message
    });
  }
};

exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found!' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving sale information!',
      error: error.message
    });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found!' });
    }
    await sale.update(req.body);
    res.json(sale);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating sale!',
      error: error.message
    });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found!' });
    }
    await sale.destroy();
    res.json({ message: 'Sale deleted successfully!' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting sale!',
      error: error.message
    });
  }
};
