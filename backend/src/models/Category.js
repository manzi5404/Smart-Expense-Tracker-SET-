const { DataTypes } = require('sequelize');

const Category = (sequelize) => {
  return sequelize.define('Category', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
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
    timestamps: false
  });
};

module.exports = Category;

