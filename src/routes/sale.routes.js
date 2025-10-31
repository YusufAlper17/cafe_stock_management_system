const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.jwt');
const {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale
} = require('../controllers/sale.controller');

router.post('/', verifyToken, createSale);
router.get('/', verifyToken, getSales);
router.get('/:id', verifyToken, getSale);
router.put('/:id', verifyToken, updateSale);
router.delete('/:id', verifyToken, deleteSale);

module.exports = router;
