const { DataTypes } = require('sequelize');

const Budget = (sequelize) => {
  return sequelize.define('Budget', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    limit_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    spent_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    period: {
      type: DataTypes.ENUM('weekly', 'monthly'),
      allowNull: false,
      defaultValue: 'monthly'
    }
  }, {
    tableName: 'budgets',
    timestamps: true,
    underscored: true
  });
};

module.exports = Budget;