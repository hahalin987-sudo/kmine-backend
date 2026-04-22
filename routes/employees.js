const express = require('express');
const router = express.Router();
const kv = require('../kv-store');

router.get('/', async function(req, res) {
  try {
    var result = await kv.paginate('employees', {
      page: parseInt(req.query.page || 1),
      pageSize: parseInt(req.query.pageSize || 20),
      keyword: req.query.keyword || '',
      status: req.query.status || '',
      department: req.query.department || ''
    });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/terminated', async function(req, res) {
  try {
    var items = await kv.find('employees', function(e) { return e.status === 'terminated'; });
    res.json({ items: items, total: items.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async function(req, res) {
  try {
    var item = await kv.getById('employees', req.params.id);
    if (!item) return res.status(404).json({ message: 'Employee not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async function(req, res) {
  try {
    var body = req.body;
    if (!body.empNo || !body.name) return res.status(400).json({ message: 'Employee number and name are required' });
    
    // Check duplicate empNo
    var existing = await kv.find('employees', function(e) { return e.empNo === body.empNo; });
    if (existing.length > 0) return res.status(409).json({ message: 'Employee number already exists' });
    
    var record = await kv.add('employees', {
      empNo: body.empNo,
      voterNo: body.voterNo || '',
      name: body.name,
      nameFr: body.nameFr || '',
      department: body.department || '',
      position: body.position || '',
      gender: body.gender || '',
      phone: body.phone || '',
      team: body.team || '公司',
      roomNo: body.roomNo || '',
      status: body.status || 'active',
      nationality: body.nationality || ''
    });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', async function(req, res) {
  try {
    var body = req.body;
    var record = await kv.update('employees', req.params.id, {
      empNo: body.empNo,
      voterNo: body.voterNo || '',
      name: body.name,
      nameFr: body.nameFr || '',
      department: body.department || '',
      position: body.position || '',
      gender: body.gender || '',
      phone: body.phone || '',
      team: body.team || '公司',
      roomNo: body.roomNo || '',
      status: body.status || 'active',
      nationality: body.nationality || ''
    });
    if (!record) return res.status(404).json({ message: 'Employee not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', async function(req, res) {
  try {
    await kv.remove('employees', req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/import', async function(req, res) {
  try {
    var data = req.body.data;
    if (!Array.isArray(data) || data.length === 0) return res.status(400).json({ message: 'Import data is empty' });
    var count = 0;
    for (var i = 0; i < data.length; i++) {
      var emp = data[i];
      if (emp.empNo && emp.name) {
        await kv.add('employees', {
          empNo: emp.empNo, voterNo: emp.voterNo || '', name: emp.name,
          nameFr: emp.nameFr || '', department: emp.department || '', position: emp.position || '',
          gender: emp.gender || '', phone: emp.phone || '', team: emp.team || '公司',
          roomNo: emp.roomNo || '', status: emp.status || 'active', nationality: emp.nationality || ''
        });
        count++;
      }
    }
    res.json({ message: 'Imported ' + count + ' records' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/reactivate', async function(req, res) {
  try {
    var record = await kv.update('employees', req.params.id, { status: 'active', terminatedDate: null });
    if (!record) return res.status(404).json({ message: 'Employee not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;