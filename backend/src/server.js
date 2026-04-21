require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    console.log('🚀 Server ready - Run `npm run db:reset` first to create tables');
    
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`\n🎉 Server running on http://127.0.0.1:${PORT}`);
      console.log(`📋 API Docs: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth: POST /api/auth/register & /api/auth/login`);
      console.log(`📊 Test: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
