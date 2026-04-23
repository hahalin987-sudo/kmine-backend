const serverless = require('serverless-http');
const express = require('express');

const app = express();

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'K矿管理 API', version: '1.0', path: '/' });
});

// Health endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), storage: process.env.KV_REST_API_URL ? 'vercel-kv' : 'memory' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), storage: process.env.KV_REST_API_URL ? 'vercel-kv' : 'memory' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    res.json({ token: 'mock-token-admin', user: { id: 1, username: 'admin', role: 'admin', name: '管理员' } });
  } else if (username === 'ft' && password === 'admin123') {
    res.json({ token: 'mock-token-ft', user: { id: 2, username: 'ft', role: 'operator', name: '操作员' } });
  } else {
    res.status(401).json({ error: '用户名或密码错误' });
  }
});

// Employees endpoint
app.get('/api/employees', (req, res) => {
  res.json([
    { id: 1, name: '张三', department: '采矿部', position: '矿工', phone: '13800138001', status: 'active' },
    { id: 2, name: '李四', department: '运输部', position: '司机', phone: '13800138002', status: 'active' },
    { id: 3, name: '王五', department: '安全部', position: '安全员', phone: '13800138003', status: 'active' }
  ]);
});

module.exports = app;