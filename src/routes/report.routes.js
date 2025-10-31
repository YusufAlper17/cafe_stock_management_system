const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.jwt');
const {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getArchives,
  getAnalytics
} = require('../controllers/report.controller');

router.get('/daily', verifyToken, getDailyReport);
router.get('/weekly', verifyToken, getWeeklyReport);
router.get('/monthly', verifyToken, getMonthlyReport);
router.get('/archives', verifyToken, getArchives);
router.get('/analytics', verifyToken, getAnalytics);

module.exports = router;
