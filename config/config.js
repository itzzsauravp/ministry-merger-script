require('dotenv').config();

module.exports = {
  development: {
    username: process.env.PG_USERNAME || 'sauravp',
    password: process.env.PG_PASSWORD || 'root',
    database: process.env.PG_DATABASE || 'npbmis',
    host: process.env.PG_HOST || '127.0.0.1',
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: console.log
  },
  test: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT, 10) || 5432,
    dialect: 'postgres',
    logging: false
  }
};
