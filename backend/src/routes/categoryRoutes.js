const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getCategories, createCategory, deleteCategory, seedCategories } = require('../controllers/categoryController');

router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);
router.post('/seed', seedCategories);
router.delete('/:id', deleteCategory);

module.exports = router;

