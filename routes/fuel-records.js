const express = require('express');
const router = express.Router();
const kv = require('../kv-store');

router.get('/', async function(req, res) {
  try {
    var result = await kv.paginate('fuel_records', {
      page: parseInt(req.query.page || 1),
      pageSize: parseInt(req.query.pageSize || 20)
    });
    res.json(result);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async function(req, res) {
  try {
    var body = req.body;
    if (!body.vehicle || !body.liters) return res.status(400).json({ message: 'Vehicle and liters are required' });
    var record = await kv.add('fuel_records', {
      date: body.date || new Date().toISOString().slice(0,10), time: body.time || '',
      vehicle: body.vehicle, vehiclePlate: body.vehiclePlate || body.vehicle,
      liters: body.liters, team: body.team || '公司', location: body.location || ''
    });
    res.json(record);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async function(req, res) {
  try {
    await kv.remove('fuel_records', req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;