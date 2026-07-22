require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST || '127.0.0.1',
  database: process.env.PG_DATABASE || 'npbmis',
  user: process.env.PG_USERNAME || 'sauravp',
  password: process.env.PG_PASSWORD || 'root',
  port: parseInt(process.env.PG_PORT || '5432', 10),
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
};
