const { Category } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const getCategories = async (req, res) => {
  try {
    const { type } = req.query; // Filter by income/expense

    const where = {};
    if (type) {
      where.type = type;
    }

    const categories = await Category.findAll({
      where,
      order: [['name', 'ASC']]
    });

    return successResponse(res, categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(res, 'Failed to get categories', 500);
  }
};

module.exports = {
  getCategories
};

