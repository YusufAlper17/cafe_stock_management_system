const db = require('../models');
const Product = db.Product;
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
}).single('image');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          message: 'Dosya yükleme hatası',
          error: err.message
        });
      }

      console.log('Request body:', req.body);

      const { name, stock, price, cost_price, category } = req.body;

      // Validate required fields
      if (!name || !price) {
        return res.status(400).json({
          message: 'Ürün adı ve satış fiyatı zorunludur'
        });
      }

      try {
        const store_id = req.user.store_id;

        const productData = {
          name,
          price: parseFloat(price),
          cost_price: cost_price ? parseFloat(cost_price) : null,
          stock: stock ? parseInt(stock) : 0,
          category,
          store_id,
          image_url: req.file ? `/uploads/${req.file.filename}` : null
        };

        console.log('Creating product with data:', productData);

        const product = await Product.create(productData);

        console.log('Product created successfully:', product);

        res.status(201).json({
          message: 'Ürün başarıyla eklendi',
          product
        });
      } catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
          message: 'Ürün eklenirken hata oluştu',
          error: error.message
        });
      }
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({
      message: 'Ürün eklenirken hata oluştu',
      error: error.message
    });
  }
};

// Get all products for a store
exports.getProducts = async (req, res) => {
  try {
    const store_id = req.user.store_id;
    const products = await Product.findAll({
      where: { store_id },
      order: [['createdAt', 'DESC']]
    });

    res.json(products);
  } catch (error) {
    console.error('Product listing error:', error);
    res.status(500).json({
      message: 'Ürünler yüklenirken hata oluştu',
      error: error.message
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const store_id = req.user.store_id;

    upload(req, res, async function (err) {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          message: 'Dosya yükleme hatası',
          error: err.message
        });
      }

      const product = await Product.findOne({
        where: { id, store_id }
      });

      if (!product) {
        return res.status(404).json({
          message: 'Ürün bulunamadı'
        });
      }

      const { name, stock, price, cost_price, category } = req.body;

      const updates = {
        name,
        price: price ? parseFloat(price) : product.price,
        cost_price: cost_price ? parseFloat(cost_price) : product.cost_price,
        stock: stock ? parseInt(stock) : product.stock,
        category: category || product.category
      };

      if (req.file) {
        updates.image_url = `/uploads/${req.file.filename}`;
      }

      await product.update(updates);

      res.json({
        message: 'Ürün başarıyla güncellendi',
        product
      });
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({
      message: 'Ürün güncellenirken hata oluştu',
      error: error.message
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const store_id = req.user.store_id;

    const product = await Product.findOne({
      where: { id, store_id }
    });

    if (!product) {
      return res.status(404).json({
        message: 'Ürün bulunamadı'
      });
    }

    await product.destroy();

    res.json({
      message: 'Ürün başarıyla silindi'
    });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({
      message: 'Ürün silinirken hata oluştu',
      error: error.message
    });
  }
};
