const { DataTypes } = require('sequelize');

const NotificationSettings = (sequelize) => {
  return sequelize.define('NotificationSettings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    budget_alerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    expense_alerts: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    weekly_reports: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    monthly_reports: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    frequency: {
      type: DataTypes.ENUM('immediate', 'daily', 'weekly'),
      allowNull: false,
      defaultValue: 'weekly'
    }
  }, {
    tableName: 'notification_settings',
    timestamps: true,
    underscored: true
  });
};

module.exports = NotificationSettings;