const { seedAll } = require('../kv-store');

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    await seedAll();
    res.json({ success: true, message: 'Database initialized and seeded successfully' });
  } catch (err) {
    console.error('Init error:', err);
    res.status(500).json({ message: 'Initialization failed', error: err.message });
  }
};