const { Category } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const DEFAULT_CATEGORIES = [
  { name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { name: 'Freelance', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#8b5cf6' },
  { name: 'Other Income', type: 'income', icon: 'Plus', color: '#6366f1' },
  { name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#f59e0b' },
  { name: 'Transportation', type: 'expense', icon: 'Car', color: '#3b82f6' },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { name: 'Bills & Utilities', type: 'expense', icon: 'Receipt', color: '#ef4444' },
  { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#8b5cf6' },
  { name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#10b981' },
  { name: 'Education', type: 'expense', icon: 'Book', color: '#0ea5e9' },
  { name: 'Other Expenses', type: 'expense', icon: 'MoreHorizontal', color: '#6b7280' },
];

const getCategories = async (req, res) => {
  try {
    const userId = req.userId;
    const { type } = req.query;

    console.log('[DEBUG] getCategories - userId:', userId);

    const where = { user_id: userId };
    if (type) {
      where.type = type;
    }

    const categories = await Category.findAll({
      where,
      order: [['name', 'ASC']]
    });

    console.log('[DEBUG] getCategories - found:', categories.length);
    return successResponse(res, categories);
  } catch (error) {
    console.error('Get categories error:', error);
    return errorResponse(res, 'Failed to get categories', 500);
  }
};

const createCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, type, icon, color } = req.body;

    if (!name || !type) {
      return errorResponse(res, 'Name and type are required', 400);
    }

    if (!['income', 'expense'].includes(type)) {
      return errorResponse(res, 'Type must be income or expense', 400);
    }

    const existingCategory = await Category.findOne({
      where: { user_id: userId, name }
    });

    if (existingCategory) {
      return errorResponse(res, 'Category with this name already exists', 400);
    }

    const category = await Category.create({
      user_id: userId,
      name,
      type,
      icon: icon || 'Tag',
      color: color || '#6366f1'
    });

    return successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    console.error('Create category error:', error);
    return errorResponse(res, 'Failed to create category', 500);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, user_id: userId }
    });

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    await category.destroy();

    return successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    console.error('Delete category error:', error);
    return errorResponse(res, 'Failed to delete category', 500);
  }
};



module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};

