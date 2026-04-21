require('dotenv').config();
const { Sequelize } = require('sequelize');

function parseDatabaseUrl(url) {
  try {
    const match = url.match(/mysql:\/\/([^:]+):([^@]+)@(.+):(\d+)\/(.+)/);
    if (!match) return null;
    return {
      username: match[1],
      password: match[2],
      host: match[3],
      port: parseInt(match[4], 10),
      database: match[5]
    };
  } catch {
    return null;
  }
}

function getDbConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const defaults = isProduction ? {
    username: 'root',
    password: '',
    database: 'smartExpenseTracker',
    host: 'localhost',
    port: 3306
  } : {
    username: 'root',
    password: '',
    database: 'smartExpenseTracker',
    host: 'localhost',
    port: 3306
  };

  if (process.env.DATABASE_URL) {
    const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
    if (parsed) {
      return {
        database: parsed.database,
        username: parsed.username,
        password: parsed.password,
        host: parsed.host,
        port: parsed.port,
        dialect: 'mysql',
        logging: false,
        pool: {
          max: isProduction ? 20 : 5,
          min: isProduction ? 5 : 0,
          acquire: 30000,
          idle: 10000,
          connectTimeout: 10000
        },
        dialectOptions: {
          connectTimeout: 10000
        }
      };
    }
  }

  return {
    username: process.env.DB_USER || defaults.username,
    password: process.env.DB_PASSWORD ?? defaults.password,
    database: process.env.DB_NAME || defaults.database,
    host: process.env.DB_HOST || defaults.host,
    port: parseInt(process.env.DB_PORT || defaults.port, 10),
    dialect: 'mysql',
    logging: false,
    pool: {
      max: isProduction ? 20 : 5,
      min: isProduction ? 5 : 0,
      acquire: 30000,
      idle: 10000,
      connectTimeout: 10000
    },
    dialectOptions: {
      connectTimeout: 10000
    }
  };
}

const dbConfig = getDbConfig();

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    dialectOptions: dbConfig.dialectOptions
  }
);

module.exports = { sequelize, config: { development: dbConfig, production: dbConfig } };