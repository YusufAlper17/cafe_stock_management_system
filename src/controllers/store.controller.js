const db = require('../models');
const Store = db.Store;

exports.createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({
      message: 'Mağaza oluşturulurken hata oluştu!',
      error: error.message
    });
  }
};

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    res.status(500).json({
      message: 'Mağazalar listelenirken hata oluştu!',
      error: error.message
    });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Mağaza bulunamadı!' });
    }
    res.json(store);
  } catch (error) {
    res.status(500).json({
      message: 'Mağaza bilgileri alınırken hata oluştu!',
      error: error.message
    });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Mağaza bulunamadı!' });
    }
    await store.update(req.body);
    res.json(store);
  } catch (error) {
    res.status(500).json({
      message: 'Mağaza güncellenirken hata oluştu!',
      error: error.message
    });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Mağaza bulunamadı!' });
    }
    await store.destroy();
    res.json({ message: 'Mağaza başarıyla silindi!' });
  } catch (error) {
    res.status(500).json({
      message: 'Mağaza silinirken hata oluştu!',
      error: error.message
    });
  }
};
