'use strict';

const mockCategories = [
  { id: 'salary', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#10b981' },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#06b6d4' },
  { id: 'investments', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#8b5cf6' },
  { id: 'other_income', name: 'Other Income', type: 'income', icon: 'Plus', color: '#6366f1' },
  { id: 'food', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#f59e0b' },
  { id: 'transport', name: 'Transportation', type: 'expense', icon: 'Car', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#ec4899' },
  { id: 'bills', name: 'Bills & Utilities', type: 'expense', icon: 'Receipt', color: '#ef4444' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#8b5cf6' },
  { id: 'health', name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#10b981' },
  { id: 'education', name: 'Education', type: 'expense', icon: 'Book', color: '#0ea5e9' },
  { id: 'other_expense', name: 'Other Expenses', type: 'expense', icon: 'MoreHorizontal', color: '#6b7280' },
];

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', mockCategories, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};

