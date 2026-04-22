const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const b = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (b) headers['Content-Length'] = Buffer.byteLength(b);
    const req = http.request({ hostname: 'localhost', port: 3000, path, method, headers }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, data: d }); }
      });
    });
    req.on('error', reject);
    if (b) req.write(b);
    req.end();
  });
}

async function main() {
  const login = await request('POST', '/api/auth/login', { username: 'admin', password: 'admin123' });
  const token = login.data.token;

  const emp = await request('GET', '/api/employees?page=1&pageSize=3', null, token);
  console.log('GET /api/employees →', emp.status, JSON.stringify(emp.data).slice(0, 300));
}

main().catch(e => console.error('Error:', e.message));
