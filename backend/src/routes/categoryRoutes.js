const express = require('express');
const router = express.Router();
// Categories are global/public - no auth needed
const { getCategories } = require('../controllers/categoryController');

router.get('/', getCategories);

module.exports = router;

