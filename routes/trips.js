const express = require('express');
const router = express.Router();
const kv = require('../kv-store');

router.get('/', async function(req, res) {
  try {
    var result = await kv.paginate('trips', {
      page: parseInt(req.query.page || 1),
      pageSize: parseInt(req.query.pageSize || 20)
    });
    res.json(result);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async function(req, res) {
  try {
    var body = req.body;
    if (!body.vehicle || !body.driver) return res.status(400).json({ message: 'Vehicle and driver are required' });
    var record = await kv.add('trips', {
      date: body.date || new Date().toISOString().slice(0,10),
      vehicle: body.vehicle, vehiclePlate: body.vehiclePlate || body.vehicle,
      driver: body.driver, shift: body.shift || '早班',
      tons: body.tons || 0, status: body.status || 'completed',
      team: body.team || '公司', from: body.from || '', to: body.to || '',
      tripCount: body.tripCount || 0, notes: body.notes || ''
    });
    res.json(record);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async function(req, res) {
  try { await kv.remove('trips', req.params.id); res.json({ message: 'Deleted successfully' }); }
  catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;