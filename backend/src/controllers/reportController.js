const { Transaction } = require('../models');
const { Op } = require('sequelize');
const { successResponse, errorResponse } = require('../utils/response');

const getSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'month' } = req.query;

    let where = { user_id: userId };
    if (period === 'month') {
      where.date = {
        [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
      };
    }

    const totalIncome = await Transaction.sum('amount', {
      where: { ...where, type: 'income' }
    }) || 0;

    const totalExpenses = await Transaction.sum('amount', {
      where: { ...where, type: 'expense' }
    }) || 0;

    return successResponse(res, {
      totalIncome: parseFloat(totalIncome),
      totalExpenses: parseFloat(totalExpenses),
      balance: parseFloat(totalIncome) - parseFloat(totalExpenses)
    });
  } catch (error) {
    console.error('Get summary error:', error);
    return errorResponse(res, 'Failed to get summary', 500);
  }
};

const getSpendingByCategory = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'month' } = req.query;

    let where = { user_id: userId, type: 'expense' };
    if (period === 'month') {
      where.date = {
        [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
      };
    }

    const spending = await Transaction.findAll({
      attributes: [
        'category',
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('amount')), 'total']
      ],
      where,
      group: ['category'],
      raw: true
    });

    const formatted = spending.map(item => ({
      category: item.category,
      amount: parseFloat(item.total)
    }));

    return successResponse(res, formatted);
  } catch (error) {
    console.error('Get spending by category error:', error);
    return errorResponse(res, 'Failed to get spending data', 500);
  }
};

const getMonthlyTrend = async (req, res) => {
  try {
    const userId = req.userId;
    const { months = 6 } = req.query;

    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - parseInt(months), 1);

    const trendData = await Transaction.findAll({
      attributes: [
        [Transaction.sequelize.fn('DATE_FORMAT', Transaction.sequelize.col('date'), '%Y-%m'), 'month'],
        'type',
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('amount')), 'total']
      ],
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
        }
      },
      group: ['month', 'type'],
      order: [['date', 'ASC']],
      raw: true
    });

    // Format months
    const monthsArray = [];
    for (let i = parseInt(months) - 1; i >= 0; i--) {
      const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
      monthsArray.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }

    const incomeData = monthsArray.map(month => 0);
    const expenseData = monthsArray.map(month => 0);

    trendData.forEach(item => {
      const monthIndex = monthsArray.indexOf(item.month);
      if (monthIndex !== -1) {
        if (item.type === 'income') {
          incomeData[monthIndex] = parseFloat(item.total);
        } else {
          expenseData[monthIndex] = parseFloat(item.total);
        }
      }
    });

    return successResponse(res, {
      months: monthsArray,
      income: incomeData,
      expenses: expenseData
    });
  } catch (error) {
    console.error('Get monthly trend error:', error);
    return errorResponse(res, 'Failed to get trend data', 500);
  }
};

module.exports = {
  getSummary,
  getSpendingByCategory,
  getMonthlyTrend
};

