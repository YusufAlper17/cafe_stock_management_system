const express = require('express');
const router = express.Router();
const {
  generateMonthlyArchive,
  getMonthlyArchives,
  getMonthlyArchive
} = require('../controllers/archive.controller');
const { verifyToken } = require('../middleware/auth.jwt');
const { checkRole } = require('../middleware/role.middleware');

// All routes require authentication and manager/admin role
router.use(verifyToken);
router.use(checkRole('admin', 'manager'));

// Generate monthly archive
router.post('/generate', generateMonthlyArchive);

// Get all monthly archives with optional year filter
router.get('/', getMonthlyArchives);

// Get specific monthly archive
router.get('/:id', getMonthlyArchive);

module.exports = router;
