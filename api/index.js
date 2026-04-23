// Vercel Node.js serverless function
// Using @vercel/node builder - handler receives (req, res)

module.exports = (req, res) => {
  const { method, url, headers, body } = req;
  
  console.log(`[VERCEL] ${method} ${url}`);
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const pathname = url.split('?')[0];
  
  if (pathname === '/api' || pathname === '/api/') {
    res.status(200).json({ 
      status: 'ok', 
      time: new Date().toISOString(),
      storage: process.env.KV_REST_API_URL ? 'vercel-kv' : 'memory'
    });
    return;
  }
  
  if (pathname === '/api/health') {
    res.status(200).json({ 
      status: 'ok', 
      time: new Date().toISOString(),
      storage: process.env.KV_REST_API_URL ? 'vercel-kv' : 'memory'
    });
    return;
  }
  
  if (pathname === '/api/auth/login' && method === 'POST') {
    try {
      const data = typeof body === 'string' ? JSON.parse(body) : body;
      const { username, password } = data || {};
      
      if (username === 'admin' && password === 'admin123') {
        res.status(200).json({ 
          token: 'admin-token-' + Date.now(), 
          user: { id: 1, username: 'admin', role: 'admin', name: '管理员' } 
        });
      } else if (username === 'ft' && password === 'admin123') {
        res.status(200).json({ 
          token: 'ft-token-' + Date.now(), 
          user: { id: 2, username: 'ft', role: 'operator', name: '操作员' } 
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (e) {
      res.status(400).json({ error: 'Invalid request body' });
    }
    return;
  }
  
  // Not found
  res.status(404).json({ error: 'Not found', path: pathname });
};