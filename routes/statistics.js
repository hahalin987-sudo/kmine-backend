const express = require('express');
const router = express.Router();
const kv = require('../kv-store');

router.get('/dashboard', async function(req, res) {
  try {
    var emps = await kv.find('employees', function(e) { return e.status === 'active'; });
    var vehs = await kv.find('vehicles', function(v) { return v.status === 'active'; });
    var fuels = await kv.getAll('fuel_records');
    var tripList = await kv.find('trips', function(t) { return t.status === 'completed'; });
    var checks = await kv.getAll('checklists');
    
    var fuelTotal = fuels.reduce(function(s, f) { return s + (parseFloat(f.liters) || 0); }, 0);
    var passedCount = checks.filter(function(c) { return c.passed; }).length;
    
    res.json({
      employees: emps.length,
      vehicles: vehs.length,
      fuelTotal: fuelTotal,
      trips: tripList.length,
      checklists: checks.length,
      checklistPassRate: checks.length > 0 ? Math.round((passedCount / checks.length) * 100) : 0
    });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/fuel', async function(req, res) {
  try {
    var records = await kv.getAll('fuel_records');
    records.sort(function(a,b) { return String(b.date||'').localeCompare(String(a.date||'')); });
    var total = records.reduce(function(s, f) { return s + (parseFloat(f.liters) || 0); }, 0);
    var companyTotal = records.filter(function(f) { return f.team === '公司'; }).reduce(function(s,f){return s+(parseFloat(f.liters)||0);},0);
    var coopTotal = records.filter(function(f) { return f.team === '合作单位'; }).reduce(function(s,f){return s+(parseFloat(f.liters)||0);},0);
    res.json({ records: records.slice(0,30), total: total, companyTotal: companyTotal, cooperativeTotal: coopTotal });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/checklists', async function(req, res) {
  try {
    var records = await kv.getAll('checklists');
    records.sort(function(a,b) { return String(b.date||'').localeCompare(String(a.date||'')); });
    var total = records.length;
    var passed = records.filter(function(c) { return c.passed; }).length;
    var failed = total - passed;
    res.json({ records: records.slice(0,30), total: total, passed: passed, failed: failed, passRate: total > 0 ? Math.round((passed/total)*100) : 0 });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/trips', async function(req, res) {
  try {
    var records = await kv.getAll('trips');
    records.sort(function(a,b) { return String(b.date||'').localeCompare(String(a.date||'')); });
    var total = records.reduce(function(s, t) { return s + (parseFloat(t.tons) || 0); }, 0);
    var companyTotal = records.filter(function(t) { return t.team === '公司'; }).reduce(function(s,t){return s+(parseFloat(t.tons)||0);},0);
    var coopTotal = records.filter(function(t) { return t.team === '合作单位'; }).reduce(function(s,t){return s+(parseFloat(t.tons)||0);},0);
    res.json({ records: records.slice(0,30), total: total, companyTotal: companyTotal, cooperativeTotal: coopTotal });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;