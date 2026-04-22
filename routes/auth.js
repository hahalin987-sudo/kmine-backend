const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const kv = require('../kv-store');
const { signToken } = require('../auth');

router.post('/login', async function(req, res) {
  try {
    var body = req.body;
    if (!body.username || !body.password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    var users = await kv.find('users', function(u) { return u.username === body.username; });
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    var user = users[0];
    var valid = await bcrypt.compare(body.password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    var token = signToken({ id: user.id, username: user.username, role: user.role });
    res.json({
      token: token,
      user: { id: user.id, username: user.username, name: user.name, role: user.role, department: user.department }
    });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

router.post('/wx-login', async function(req, res) {
  try {
    var code = req.body.code;
    if (!code) return res.status(400).json({ message: 'Missing code parameter' });
    var users = await kv.find('users', function(u) { return u.username === code; });
    if (users.length === 0) {
      var token = signToken({ id: 0, username: 'wx_' + code, role: '访客' });
      return res.json({ token: token, user: { id: 0, username: 'wx_' + code, role: '访客' } });
    }
    var user = users[0];
    var token = signToken({ id: user.id, username: user.username, role: user.role });
    res.json({ token: token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;