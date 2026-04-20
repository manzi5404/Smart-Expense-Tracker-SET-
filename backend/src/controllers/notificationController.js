const { NotificationSettings } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');

const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;

    const settings = await NotificationSettings.findOne({
      where: { user_id: userId }
    });

    if (!settings) {
      return errorResponse(res, 'Settings not found', 404);
    }

    // Format to match frontend expectations
    const formatted = {
      budgetAlerts: settings.budget_alerts,
      expenseAlerts: settings.expense_alerts,
      weeklyReports: settings.weekly_reports,
      monthlySummary: settings.monthly_reports,
      frequency: settings.frequency
    };

    return successResponse(res, formatted);
  } catch (error) {
    console.error('Get notification settings error:', error);
    return errorResponse(res, 'Failed to get settings', 500);
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      budgetAlerts,
      expenseAlerts,
      weeklyReports,
      monthlySummary,
      frequency
    } = req.body;

    const settings = await NotificationSettings.findOne({
      where: { user_id: userId }
    });

    if (!settings) {
      return errorResponse(res, 'Settings not found', 404);
    }

    await settings.update({
      budget_alerts: budgetAlerts !== undefined ? budgetAlerts : settings.budget_alerts,
      expense_alerts: expenseAlerts !== undefined ? expenseAlerts : settings.expense_alerts,
      weekly_reports: weeklyReports !== undefined ? weeklyReports : settings.weekly_reports,
      monthly_reports: monthlySummary !== undefined ? monthlySummary : settings.monthly_reports,
      frequency: frequency || settings.frequency
    });

    const formatted = {
      budgetAlerts: settings.budget_alerts,
      expenseAlerts: settings.expense_alerts,
      weeklyReports: settings.weekly_reports,
      monthlySummary: settings.monthly_reports,
      frequency: settings.frequency
    };

    return successResponse(res, formatted, 'Settings updated successfully');
  } catch (error) {
    console.error('Update notification settings error:', error);
    return errorResponse(res, 'Failed to update settings', 500);
  }
};

module.exports = {
  getNotificationSettings,
  updateNotificationSettings
};

