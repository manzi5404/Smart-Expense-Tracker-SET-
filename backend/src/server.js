require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    try {
      await sequelize.sync();
      console.log('✅ Database tables synchronized');
    } catch (syncError) {
      console.warn('⚠️ Table sync skipped:', syncError.message);
    }

    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
    
    app.listen(PORT, host, () => {
      console.log(`\n🎉 Server running on http://${host}:${PORT}`);
      console.log(`🔐 Auth: POST /api/auth/register & /api/auth/login`);
      console.log(`📊 Test: GET /api/health`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    process.exit(1);
  }
};

startServer();
