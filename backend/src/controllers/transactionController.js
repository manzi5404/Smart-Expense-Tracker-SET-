const { Transaction, Budget } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

const formatTransaction = (tx) => ({
  id: tx.id,
  amount: parseFloat(tx.amount),
  category: tx.category,
  type: tx.type,
  date: tx.date,
  description: tx.description
});

const formatTransactions = (transactions) => transactions.map(formatTransaction);

const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type, page = 1, limit = 20 } = req.query;
    const userId = req.userId;

    const where = { user_id: userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = startDate;
      if (endDate) where.date[Op.lte] = endDate;
    }
    if (category) where.category = category;
    if (type) where.type = type;

    const offset = (page - 1) * limit;
    const { count, rows } = await Transaction.findAndCountAll({
      where,
      order: [['date', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return successResponse(res, {
      transactions: formatTransactions(rows),
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return errorResponse(res, 'Failed to get transactions', 500);
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId }
    });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    return successResponse(res, formatTransaction(transaction));
  } catch (error) {
    console.error('Get transaction error:', error);
    return errorResponse(res, 'Failed to get transaction', 500);
  }
};

const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;
    const userId = req.userId;

    if (!amount || !type || !category) {
      return errorResponse(res, 'Amount, type and category are required', 400);
    }

    if (!['income', 'expense'].includes(type)) {
      return errorResponse(res, 'Type must be income or expense', 400);
    }

    const transaction = await Transaction.create({
      user_id: userId,
      amount,
      type,
      category,
      description,
      date: date || new Date().toISOString().split('T')[0]
    });

    if (type === 'expense') {
      const budget = await Budget.findOne({
        where: {
          user_id: userId,
          category,
          period: 'monthly'
        }
      });

      if (budget) {
        budget.spent_amount = parseFloat(budget.spent_amount) + parseFloat(amount);
        await budget.save();
      }
    }

    return successResponse(res, formatTransaction(transaction), 'Transaction created successfully', 201);
  } catch (error) {
    console.error('Create transaction error:', error);
    return errorResponse(res, 'Failed to create transaction', 500);
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, description, date } = req.body;
    const userId = req.userId;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId }
    });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    const oldAmount = parseFloat(transaction.amount);
    const oldType = transaction.type;
    const oldCategory = transaction.category;

    if (type === 'expense' && oldType === 'expense') {
      const budget = await Budget.findOne({
        where: {
          user_id: userId,
          category: oldCategory,
          period: 'monthly'
        }
      });
      if (budget) {
        budget.spent_amount = parseFloat(budget.spent_amount) - oldAmount;
        if (category === oldCategory && amount) {
          budget.spent_amount = budget.spent_amount + parseFloat(amount);
        }
        await budget.save();
      }
    }

    await transaction.update({
      amount: amount || transaction.amount,
      type: type || transaction.type,
      category: category || transaction.category,
      description: description !== undefined ? description : transaction.description,
      date: date || transaction.date
    });

    if (transaction.type === 'expense') {
      const budget = await Budget.findOne({
        where: {
          user_id: userId,
          category: transaction.category,
          period: 'monthly'
        }
      });

      if (budget) {
        const expenses = await Transaction.sum('amount', {
          where: {
            user_id: userId,
            type: 'expense',
            category: transaction.category
          }
        });
        budget.spent_amount = expenses || 0;
        await budget.save();
      }
    }

    return successResponse(res, formatTransaction(transaction), 'Transaction updated successfully');
  } catch (error) {
    console.error('Update transaction error:', error);
    return errorResponse(res, 'Failed to update transaction', 500);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const transaction = await Transaction.findOne({
      where: { id, user_id: userId }
    });

    if (!transaction) {
      return errorResponse(res, 'Transaction not found', 404);
    }

    if (transaction.type === 'expense') {
      const budget = await Budget.findOne({
        where: {
          user_id: userId,
          category: transaction.category,
          period: 'monthly'
        }
      });

      if (budget) {
        budget.spent_amount = parseFloat(budget.spent_amount) - parseFloat(transaction.amount);
        await budget.save();
      }
    }

    await transaction.destroy();

    return successResponse(res, null, 'Transaction deleted successfully');
  } catch (error) {
    console.error('Delete transaction error:', error);
    return errorResponse(res, 'Failed to delete transaction', 500);
  }
};

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
};