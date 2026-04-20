const { Budget, Transaction } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

const getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const { period } = req.query;

    const where = { user_id: userId };
    if (period) where.period = period;

    const budgets = await Budget.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, { budgets });
  } catch (error) {
    console.error('Get budgets error:', error);
    return errorResponse(res, 'Failed to get budgets', 500);
  }
};

const createBudget = async (req, res) => {
  try {
    const { category, limit_amount, period } = req.body;
    const userId = req.userId;

    if (!category || !limit_amount) {
      return errorResponse(res, 'Category and limit amount are required', 400);
    }

    const existingBudget = await Budget.findOne({
      where: {
        user_id: userId,
        category,
        period: period || 'monthly'
      }
    });

    if (existingBudget) {
      return errorResponse(res, 'Budget for this category already exists', 400);
    }

    const expenses = await Transaction.sum('amount', {
      where: {
        user_id: userId,
        type: 'expense',
        category
      }
    });

    const budget = await Budget.create({
      user_id: userId,
      category,
      limit_amount,
      spent_amount: expenses || 0,
      period: period || 'monthly'
    });

    return successResponse(res, budget, 'Budget created successfully', 201);
  } catch (error) {
    console.error('Create budget error:', error);
    return errorResponse(res, 'Failed to create budget', 500);
  }
};

const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, limit_amount, period } = req.body;
    const userId = req.userId;

    const budget = await Budget.findOne({
      where: { id, user_id: userId }
    });

    if (!budget) {
      return errorResponse(res, 'Budget not found', 404);
    }

    await budget.update({
      category: category || budget.category,
      limit_amount: limit_amount || budget.limit_amount,
      period: period || budget.period
    });

    return successResponse(res, budget, 'Budget updated successfully');
  } catch (error) {
    console.error('Update budget error:', error);
    return errorResponse(res, 'Failed to update budget', 500);
  }
};

const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const budget = await Budget.findOne({
      where: { id, user_id: userId }
    });

    if (!budget) {
      return errorResponse(res, 'Budget not found', 404);
    }

    await budget.destroy();

    return successResponse(res, null, 'Budget deleted successfully');
  } catch (error) {
    console.error('Delete budget error:', error);
    return errorResponse(res, 'Failed to delete budget', 500);
  }
};

module.exports = {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget
};