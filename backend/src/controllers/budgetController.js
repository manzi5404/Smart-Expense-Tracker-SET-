const { Budget, Transaction } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

const getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const { period } = req.query;

    console.log('[DEBUG] getBudgets - userId:', userId);

    const where = { user_id: userId };
    if (period) where.period = period;

    const budgets = await Budget.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
      const { startDate, endDate } = getPeriodDates(budget.period);
      
      const spent = await Transaction.sum('amount', {
        where: {
          user_id: userId,
          type: 'expense',
          category: budget.category,
          date: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      });

      return {
        ...budget.toJSON(),
        spent_amount: spent || 0
      };
    }));

    console.log('[DEBUG] getBudgets - found:', budgets.length);
    return successResponse(res, { budgets: budgetsWithSpent });
  } catch (error) {
    console.error('Get budgets error:', error);
    return errorResponse(res, 'Failed to get budgets', 500);
  }
};

const getPeriodDates = (period) => {
  const now = new Date();
  let startDate, endDate;

  if (period === 'weekly') {
    const dayOfWeek = now.getDay();
    startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek);
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
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

    const budgetPeriod = period || 'monthly';
    const { startDate, endDate } = getPeriodDates(budgetPeriod);

    const expenses = await Transaction.sum('amount', {
      where: {
        user_id: userId,
        type: 'expense',
        category,
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    });

    const budget = await Budget.create({
      user_id: userId,
      category,
      limit_amount,
      spent_amount: expenses || 0,
      period: budgetPeriod
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