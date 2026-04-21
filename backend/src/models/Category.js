const { DataTypes } = require('sequelize');

const Category = (sequelize) => {
  return sequelize.define('Category', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    underscored: true
  });
};

module.exports = Category;

