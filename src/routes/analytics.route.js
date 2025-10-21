const express = require('express');
const analyticsController = require('../controllers/analytics-controllers/analytics.controller');
const router = express.Router();

router.get('/monthly-trends', analyticsController.getMonthlyTrends);
router.get('/available-years', analyticsController.getAvailableYears);

module.exports = router;