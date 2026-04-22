const express = require('express');
const router = express.Router();
const kv = require('../kv-store');

router.get('/', async function(req, res) {
  try {
    var result = await kv.paginate('vehicles', {
      page: parseInt(req.query.page || 1),
      pageSize: parseInt(req.query.pageSize || 20),
      keyword: req.query.keyword || ''
    });
    res.json(result);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.get('/:id', async function(req, res) {
  try {
    var item = await kv.getById('vehicles', req.params.id);
    if (!item) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async function(req, res) {
  try {
    var body = req.body;
    if (!body.plate) return res.status(400).json({ message: 'Plate number is required' });
    var existing = await kv.find('vehicles', function(v) { return v.plate === body.plate; });
    if (existing.length > 0) return res.status(409).json({ message: 'Plate already exists' });
    var record = await kv.add('vehicles', {
      plate: body.plate, vin: body.vin || '', brand: body.brand || '',
      model: body.model || '', team: body.team || '公司', status: body.status || 'active'
    });
    res.json(record);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async function(req, res) {
  try {
    var body = req.body;
    var record = await kv.update('vehicles', req.params.id, {
      plate: body.plate, vin: body.vin || '', brand: body.brand || '',
      model: body.model || '', team: body.team || '公司', status: body.status || 'active'
    });
    if (!record) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(record);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async function(req, res) {
  try {
    await kv.remove('vehicles', req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;