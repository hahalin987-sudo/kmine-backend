require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { seedAll } = require('./kv-store');

const authRouter = require('./routes/auth');
const employeesRouter = require('./routes/employees');
const vehiclesRouter = require('./routes/vehicles');
const departmentsRouter = require('./routes/departments');
const fuelRecordsRouter = require('./routes/fuel-records');
const tripsRouter = require('./routes/trips');
const checklistsRouter = require('./routes/checklists');
const statisticsRouter = require('./routes/statistics');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.use('/api/auth', authRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/fuel-records', fuelRecordsRouter);
app.use('/api/trips', tripsRouter);
app.use('/api/checklists', checklistsRouter);
app.use('/api/statistics', statisticsRouter);

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', time: new Date().toISOString(), storage: process.env.KV_REST_API_URL ? 'vercel-kv' : 'memory' });
});

module.exports = app;

var isVercel = !!process.env.VERCEL;

async function start() {
  try {
    if (!isVercel) {
      console.log('Seeding data...');
      await seedAll();
      console.log('\nKMine API running at http://localhost:' + PORT);
      console.log('Health check: http://localhost:' + PORT + '/api/health');
      console.log('\nTest accounts:');
      console.log('  admin / admin123 (Admin)');
      console.log('  ft / admin123 (Operator)');
      app.listen(PORT);
    } else {
      console.log('Vercel serverless mode started');
    }
  } catch (err) {
    console.error('Startup failed:', err.message);
    if (!isVercel) process.exit(1);
  }
}

start();