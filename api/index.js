// Minimal Vercel serverless function - 直接导出，不使用 serverless-http
module.exports = (req, res) => {
  const { method, url } = req;
  
  console.log(`${method} ${url}`);
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const pathname = url.split('?')[0];
  
  if (pathname === '/' || pathname === '') {
    res.status(200).json({ message: 'K矿管理 API', version: '1.0' });
    return;
  }
  
  if (pathname === '/api' || pathname === '/api/') {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
    return;
  }
  
  if (pathname === '/api/health') {
    res.status(200).json({ status: 'ok', time: new Date().toISOString() });
    return;
  }
  
  if (pathname === '/api/auth/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        if (username === 'admin' && password === 'admin123') {
          res.status(200).json({ token: 'admin-token-xxx', user: { id: 1, username: 'admin', role: 'admin' } });
        } else if (username === 'ft' && password === 'admin123') {
          res.status(200).json({ token: 'ft-token-xxx', user: { id: 2, username: 'ft', role: 'operator' } });
        } else {
          res.status(401).json({ error: 'Invalid credentials' });
        }
      } catch {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
    return;
  }
  
  // 通用 404
  res.status(404).json({ error: 'Not found', path: pathname });
};