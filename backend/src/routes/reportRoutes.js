const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getSummary, getSpendingByCategory, getMonthlyTrend } = require('../controllers/reportController');

router.use(authMiddleware);

router.get('/summary', getSummary);
router.get('/spending', getSpendingByCategory);
router.get('/trend', getMonthlyTrend);

module.exports = router;

