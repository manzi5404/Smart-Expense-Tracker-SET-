'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notification_settings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      budget_alerts: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      expense_alerts: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      weekly_reports: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      monthly_reports: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      frequency: {
        type: Sequelize.ENUM('immediate', 'daily', 'weekly'),
        allowNull: false,
        defaultValue: 'weekly'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('notification_settings');
  }
};

