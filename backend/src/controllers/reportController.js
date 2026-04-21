const { Transaction, Category } = require('../models');
const { Op } = require('sequelize');
const { successResponse, errorResponse } = require('../utils/response');

const getDateRange = (period) => {
  const now = new Date();
  let startDate;
  let endDate;

  switch (period) {
    case 'week':
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);
      break;
    case 'month':
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

const getSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = 'month' } = req.query;
    const { startDate, endDate } = getDateRange(period);

    const where = {
      user_id: userId,
      date: {
        [Op.between]: [startDate, endDate]
      }
    };

    const totalIncome = await Transaction.sum('amount', {
      where: { ...where, type: 'income' }
    }) || 0;

    const totalExpenses = await Transaction.sum('amount', {
      where: { ...where, type: 'expense' }
    }) || 0;

    return successResponse(res, {
      totalIncome: parseFloat(totalIncome),
      totalExpenses: parseFloat(totalExpenses),
      balance: parseFloat(totalIncome) - parseFloat(totalExpenses),
      period,
      startDate,
      endDate
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
    const { startDate, endDate } = getDateRange(period);

    const where = {
      user_id: userId,
      type: 'expense',
      date: {
        [Op.between]: [startDate, endDate]
      }
    };

    const spending = await Transaction.findAll({
      attributes: [
        'category',
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('amount')), 'total']
      ],
      where,
      group: ['category'],
      raw: true
    });

    const userCategories = await Category.findAll({
      where: { user_id: userId },
      raw: true
    });
    const categoryMap = {};
    userCategories.forEach(cat => {
      categoryMap[cat.id] = { name: cat.name, color: cat.color, icon: cat.icon };
    });

    const defaultColors = ['#f59e0b', '#3b82f6', '#ec4899', '#ef4444', '#8b5cf6', '#10b981', '#06b6d4', '#0ea5e9'];
    
    const formatted = spending.map((item, index) => {
      const catInfo = categoryMap[item.category] || {};
      return {
        category: item.category,
        name: catInfo.name || item.category,
        amount: parseFloat(item.total),
        color: catInfo.color || defaultColors[index % defaultColors.length]
      };
    });

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

    const numMonths = parseInt(months) || 6;
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - numMonths, 1);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const trendData = await Transaction.findAll({
      attributes: [
        'date',
        'type',
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('amount')), 'total']
      ],
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startStr, endStr]
        }
      },
      group: ['date', 'type'],
      order: [['date', 'ASC']],
      raw: true
    });

    const monthsArray = [];
    for (let i = numMonths - 1; i >= 0; i--) {
      const date = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
      monthsArray.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    }

    const incomeData = monthsArray.map(() => 0);
    const expenseData = monthsArray.map(() => 0);

    const getMonthYear = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    trendData.forEach(item => {
      const monthYear = getMonthYear(item.date);
      const monthIndex = monthsArray.indexOf(monthYear);
      if (monthIndex !== -1) {
        if (item.type === 'income') {
          incomeData[monthIndex] += parseFloat(item.total);
        } else {
          expenseData[monthIndex] += parseFloat(item.total);
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

