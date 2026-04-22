const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL 连接池配置
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'kmine',
  password: process.env.DB_PASSWORD || 'kmine2024',
  database: process.env.DB_NAME || 'kmine',
  waitForConnections: true,
  connectionLimit: process.env.VERCEL ? 5 : 10,
  charset: 'utf8mb4',
  // SSL 配置（TiDB / 云数据库需要）
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: true,
  } : undefined,
  // 连接超时（serverless 环境需要更短的超时）
  connectTimeout: 10000,
  acquireTimeout: 10000,
});

// 验证连接
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL 连接成功:', process.env.DB_HOST || 'localhost');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL 连接失败:', err.message);
  });

module.exports = pool;
