const bcrypt = require('bcryptjs');
bcrypt.hash('admin123', 10).then(hash => {
  console.log('Hash:', hash);
  // 直接更新数据库
  const pool = require('./db');
  pool.execute('UPDATE users SET password = ?', [hash])
    .then(() => console.log('✅ 密码已更新'))
    .catch(e => console.error('DB error:', e.message))
    .finally(() => process.exit(0));
});
