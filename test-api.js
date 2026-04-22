const http = require('http');
const token = process.argv[2];
if (!token) { console.log('Usage: node test-api.js <token>'); process.exit(1); }

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: 'localhost', port: 3000, path, method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  const r1 = await get('/api/employees?page=1&pageSize=3');
  console.log('GET /api/employees:', r1.status, '- items:', r1.data.items?.length, 'total:', r1.data.total);

  const r2 = await get('/api/vehicles?pageSize=3');
  console.log('GET /api/vehicles:', r2.status, '- items:', r2.data.items?.length);

  const r3 = await get('/api/statistics/fuel');
  console.log('GET /api/statistics/fuel:', r3.status, '- total:', r3.data.total);

  const r4 = await get('/api/statistics/checklists');
  console.log('GET /api/statistics/checklists:', r4.status, '- passRate:', r4.data.passRate + '%');
}

main().catch(e => console.error(e.message));
