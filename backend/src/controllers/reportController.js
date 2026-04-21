const { Transaction, Category, Budget } = require('../models');
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

    const budgets = await Budget.findAll({
      where: { user_id: userId }
    }) || [];

    const allTransactions = await Transaction.findAll({
      where,
      order: [['date', 'DESC']],
      raw: true
    });

    console.log('[DEBUG] getSummary - transactions count:', allTransactions.length);
    if (allTransactions.length > 0) {
      console.log('[DEBUG] Sample transaction:', allTransactions[0]);
    }

    const categoriesForUser = await Category.findAll({ where: { user_id: userId }, raw: true });
    console.log('[DEBUG] getSummary - categories count:', categoriesForUser.length);
    console.log('[DEBUG] getSummary - categories:', categoriesForUser.map(c => c.name));
    
    const catMapForSummary = {};
    categoriesForUser.forEach(cat => {
      catMapForSummary[cat.name] = cat;
    });

    const transactionsWithCategoryNames = allTransactions.map(tx => {
      const cat = catMapForSummary[tx.category] || {};
      return {
        ...tx,
        categoryName: cat.name || tx.category,
        categoryColor: cat.color || '#6366f1'
      };
    });

    return successResponse(res, {
      totalIncome: parseFloat(totalIncome),
      totalExpenses: parseFloat(totalExpenses),
      balance: parseFloat(totalIncome) - parseFloat(totalExpenses),
      period,
      startDate,
      endDate,
      budgets: budgets.map(b => ({
        id: b.id,
        category: b.category,
        limit: parseFloat(b.limit_amount),
        spent: parseFloat(b.spent_amount),
        period: b.period
      })),
      transactions: transactionsWithCategoryNames,
      categories: categoriesForUser
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
        'type',
        [Transaction.sequelize.fn('SUM', Transaction.sequelize.col('amount')), 'total']
      ],
      where,
      group: ['category', 'type'],
      raw: true
    });

    const userCategories = await Category.findAll({
      where: { user_id: userId },
      raw: true
    });
    const categoryMapByName = {};
    const categoryMapById = {};
    userCategories.forEach(cat => {
      categoryMapByName[cat.name] = { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon };
      categoryMapById[cat.id] = { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon };
    });

    const allUserTransactions = await Transaction.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['date', 'DESC']],
      raw: true
    });

    const defaultColors = ['#f59e0b', '#3b82f6', '#ec4899', '#ef4444', '#8b5cf6', '#10b981', '#06b6d4', '#0ea5e9'];
    
    const incomeByCategory = {};
    const expenseByCategory = {};
    
    spending.forEach(item => {
      console.log('[DEBUG] Spending item - category:', item.category, 'type:', item.type);
      let catInfo = categoryMapByName[item.category] || categoryMapById[item.category];
      if (!catInfo) {
        console.log('[DEBUG] Category not found for:', item.category);
        catInfo = { id: null, name: item.category, color: defaultColors[Object.keys(expenseByCategory).length % defaultColors.length] };
      }
      const formattedItem = {
        category: catInfo.id || item.category,
        name: catInfo.name,
        amount: parseFloat(item.total),
        color: catInfo.color || defaultColors[Object.keys(expenseByCategory).length % defaultColors.length]
      };
      
      if (item.type === 'income') {
        incomeByCategory[catInfo.name] = formattedItem;
      } else {
        expenseByCategory[catInfo.name] = formattedItem;
      }
    });

    return successResponse(res, {
      spendingByCategory: Object.values(expenseByCategory),
      incomeByCategory: Object.values(incomeByCategory),
      allTransactions: allUserTransactions,
      categories: userCategories
    });
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

