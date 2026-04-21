const { sequelize, config } = require('../config/database');

const User = require('./User')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const Budget = require('./Budget')(sequelize);
const NotificationSettings = require('./NotificationSettings')(sequelize);
const Category = require('./Category')(sequelize);

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Budget, { foreignKey: 'user_id', as: 'budgets' });
Budget.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(NotificationSettings, { foreignKey: 'user_id', as: 'notificationSettings' });
NotificationSettings.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Category, { foreignKey: 'user_id', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  Transaction,
  Budget,
  NotificationSettings,
  Category
};
