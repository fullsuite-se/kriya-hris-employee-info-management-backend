const express = require('express');
const analyticsController = require('../controllers/analytics-controllers/analytics.controller');
const router = express.Router();

router.get('/monthly-trends', analyticsController.getMonthlyTrends);
router.get('/available-years', analyticsController.getAvailableYears);
router.get('/attrition-rate', analyticsController.getAttritionRate);
router.get('/sex-distribution', analyticsController.getSexDistribution);
router.get('/age-distribution', analyticsController.getAgeDistribution);
router.get('/tenure-distribution', analyticsController.getTenureDistribution);

module.exports = router;