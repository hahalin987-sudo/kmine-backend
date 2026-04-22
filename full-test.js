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
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(d) }));
    });
    req.on('error', reject);
    if (b) req.write(b);
    req.end();
  });
}

async function main() {
  // 1. 登录
  const login = await request('POST', '/api/auth/login', { username: 'admin', password: 'admin123' });
  console.log('POST /api/auth/login →', login.status, login.data.user?.name, '| Token:', login.data.token?.slice(0, 30) + '...');
  const token = login.data.token;

  // 2. 员工列表
  const emp = await request('GET', '/api/employees?page=1&pageSize=3', null, token);
  console.log('GET /api/employees →', emp.status, '| 总计:', emp.data.total, '人');

  // 3. 车辆列表
  const veh = await request('GET', '/api/vehicles?pageSize=5', null, token);
  console.log('GET /api/vehicles →', veh.status, '| 总计:', veh.data.total, '辆');

  // 4. 加油记录
  const fuel = await request('GET', '/api/fuel-records', null, token);
  console.log('GET /api/fuel-records →', fuel.status, '| 总计:', fuel.data.total, '条');

  // 5. 行程记录
  const trips = await request('GET', '/api/trips', null, token);
  console.log('GET /api/trips →', trips.status, '| 总计:', trips.data.total, '条');

  // 6. 点检记录
  const cl = await request('GET', '/api/checklists', null, token);
  console.log('GET /api/checklists →', cl.status, '| 总计:', cl.data.total, '条');

  // 7. 统计
  const dash = await request('GET', '/api/statistics/dashboard', null, token);
  console.log('GET /api/statistics/dashboard →', dash.status, dash.data);

  // 8. 新增员工（POST）
  const add = await request('POST', '/api/employees', { empNo: 'TEST001', name: '测试员工', position: '测试员' }, token);
  console.log('POST /api/employees →', add.status, add.data.name);

  // 9. 删除测试员工
  const del = await request('DELETE', `/api/employees/${add.data.id}`, null, token);
  console.log('DELETE /api/employees/:id →', del.status, del.data.message);

  console.log('\n✅ 所有接口测试完成！');
}

main().catch(e => console.error('Error:', e.message));
