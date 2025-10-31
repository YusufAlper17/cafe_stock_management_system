const express = require('express');
const router = express.Router();
const {
  completeSale,
  getSalesHistory,
  getSaleDetails
} = require('../controllers/sales.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const { checkRole } = require('../middleware/role.middleware');

// All routes require authentication
router.use(verifyToken);

// Complete a sale (all authenticated users)
router.post('/complete', completeSale);

// Get sales history (admin only)
router.get('/history', checkRole('admin'), getSalesHistory);

// Get sale details (admin only)
router.get('/:id', checkRole('admin'), getSaleDetails);

module.exports = router;
