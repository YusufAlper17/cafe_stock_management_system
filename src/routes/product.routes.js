const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.jwt');
const productController = require('../controllers/product.controller');

// Create a new product
router.post('/', verifyToken, productController.createProduct);

// Get all products
router.get('/', verifyToken, productController.getProducts);

// Update a product
router.put('/:id', verifyToken, productController.updateProduct);

// Delete a product
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
