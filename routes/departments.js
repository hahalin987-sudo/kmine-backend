const express = require('express');
const router = express.Router();
const kv = require('../kv-store');

router.get('/', async function(req, res) {
  try {
    var items = await kv.getAll('departments');
    res.json({ items: items, total: items.length });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.post('/', async function(req, res) {
  try {
    var body = req.body;
    if (!body.name) return res.status(400).json({ message: 'Department name is required' });
    var existing = await kv.find('departments', function(d) { return d.name === body.name; });
    if (existing.length > 0) return res.status(409).json({ message: 'Department already exists' });
    var record = await kv.add('departments', {
      name: body.name, manager: body.manager || '',
      employeeCount: body.employeeCount || 0, description: body.description || ''
    });
    res.json(record);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.put('/:id', async function(req, res) {
  try {
    var body = req.body;
    var record = await kv.update('departments', req.params.id, {
      name: body.name, manager: body.manager || '',
      employeeCount: body.employeeCount || 0, description: body.description || ''
    });
    if (!record) return res.status(404).json({ message: 'Department not found' });
    res.json(record);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

router.delete('/:id', async function(req, res) {
  try {
    await kv.remove('departments', req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;