const pool = require('./db');

const seedData = {
  departments: [
    { name: '办公室', manager: '刘华', employeeCount: 2, description: '日常行政事务管理' },
    { name: '运输部', manager: '张伟', employeeCount: 2, description: '负责矿石运输' },
    { name: '采矿部', manager: '王强', employeeCount: 3, description: '负责采矿作业' },
    { name: '安全部', manager: '李明', employeeCount: 1, description: '安全管理与监督' },
    { name: '维修部', manager: '赵军', employeeCount: 1, description: '设备维护与修理' },
    { name: '钻爆部', manager: '孙磊', employeeCount: 2, description: '钻孔与爆破作业' },
    { name: '办公室后勤部', manager: '周芳', employeeCount: 2, description: '后勤保障支持' },
    { name: '现场后勤部', manager: '吴刚', employeeCount: 1, description: '现场物资供应' },
  ],

  employees: [
    { empNo: 'EMP001', voterNo: 'V001', name: '陈刚', nameFr: 'CHEN Gang', department: '采矿部', position: '矿卡司机', gender: '男', phone: '+243 81 234 5678', team: '公司', roomNo: 'A-101', status: 'active', nationality: '中国' },
    { empNo: 'EMP002', voterNo: 'V002', name: '李伟', nameFr: 'LI Wei', department: '采矿部', position: '矿卡司机', gender: '男', phone: '+243 81 234 5679', team: '公司', roomNo: 'A-102', status: 'active', nationality: '中国' },
    { empNo: 'EMP003', voterNo: 'V003', name: '王磊', nameFr: 'WANG Lei', department: '运输部', position: '矿卡司机', gender: '男', phone: '+243 81 234 5680', team: '公司', roomNo: 'A-103', status: 'active', nationality: '中国' },
    { empNo: 'EMP004', voterNo: 'V004', name: '张强', nameFr: 'ZHANG Qiang', department: '运输部', position: '指挥工', gender: '男', phone: '+243 81 234 5681', team: '公司', roomNo: 'A-104', status: 'active', nationality: '中国' },
    { empNo: 'EMP005', voterNo: 'V005', name: '刘洋', nameFr: 'LIU Yang', department: '维修部', position: '维修工', gender: '男', phone: '+243 81 234 5682', team: '公司', roomNo: 'A-105', status: 'active', nationality: '中国' },
    { empNo: 'EMP006', voterNo: 'V006', name: '赵敏', nameFr: 'ZHAO Min', department: '办公室', position: '翻译', gender: '女', phone: '+243 81 234 5683', team: '公司', roomNo: 'A-106', status: 'active', nationality: '中国' },
    { empNo: 'EMP007', voterNo: 'V007', name: '陈军', nameFr: 'CHEN Jun', department: '安全部', position: '安全员', gender: '男', phone: '+243 81 234 5684', team: '公司', roomNo: 'A-107', status: 'terminated', nationality: '中国', terminatedDate: '2024-01-15' },
    { empNo: 'EMP008', voterNo: 'V008', name: '杨静', nameFr: 'YANG Jing', department: '采矿部', position: '加油工', gender: '女', phone: '+243 81 234 5685', team: '公司', roomNo: 'A-108', status: 'active', nationality: '中国' },
    { empNo: 'EMP009', voterNo: 'V009', name: 'MUTOMBO KASONGO', nameFr: 'MUTOMBO KASONGO', department: '钻爆部', position: '钻机操作工', gender: '男', phone: '+243 99 111 2222', team: '公司', roomNo: 'B-201', status: 'terminated', nationality: '刚果金', terminatedDate: '2024-03-01' },
    { empNo: 'EMP010', voterNo: 'V010', name: '孙鹏', nameFr: 'SUN Peng', department: '安全部', position: '安全员', gender: '男', phone: '+243 81 234 5687', team: '公司', roomNo: 'A-110', status: 'active', nationality: '中国' },
    { empNo: 'EMP011', voterNo: 'V011', name: '周亮', nameFr: 'ZHOU Liang', department: '采矿部', position: '矿卡司机', gender: '男', phone: '+243 81 234 5688', team: '公司', roomNo: 'A-111', status: 'active', nationality: '中国' },
    { empNo: 'EMP012', voterNo: 'V012', name: '吴刚', nameFr: 'WU Gang', department: '钻爆部', position: '钻机操作工', gender: '男', phone: '+243 81 234 5689', team: '公司', roomNo: 'A-112', status: 'active', nationality: '中国' },
    { empNo: 'EMP013', voterNo: 'V013', name: '郑浩', nameFr: 'ZHENG Hao', department: '采矿部', position: '矿卡司机', gender: '男', phone: '+243 81 234 5690', team: '公司', roomNo: 'A-113', status: 'active', nationality: '中国' },
    { empNo: 'EMP014', voterNo: 'V014', name: '马超', nameFr: 'MA Chao', department: '采矿部', position: '矿卡司机', gender: '男', phone: '+243 81 234 5691', team: '公司', roomNo: 'A-114', status: 'active', nationality: '中国' },
    { empNo: 'EMP015', voterNo: 'V015', name: '黄磊', nameFr: 'HUANG Lei', department: '安全部', position: '安全员', gender: '男', phone: '+243 81 234 5692', team: '公司', roomNo: 'A-115', status: 'active', nationality: '中国' },
  ],

  vehicles: [
    { plate: 'KAM-001', vin: 'VIN001', brand: '卡特彼勒', model: '793F', team: '公司', status: 'active' },
    { plate: 'KAM-002', vin: 'VIN002', brand: '卡特彼勒', model: '793F', team: '公司', status: 'active' },
    { plate: 'KAM-003', vin: 'VIN003', brand: '卡特彼勒', model: '793F', team: '公司', status: 'active' },
    { plate: 'KAM-004', vin: 'VIN004', brand: '小松', model: 'HD785-7', team: '公司', status: 'active' },
    { plate: 'BULL-001', vin: 'VIN005', brand: '卡特彼勒', model: 'D10T', team: '公司', status: 'active' },
    { plate: 'WAT-001', vin: 'VIN006', brand: '沃尔沃', model: 'A45G', team: '公司', status: 'active' },
    { plate: 'LOA-001', vin: 'VIN007', brand: '卡特彼勒', model: '992K', team: '公司', status: 'active' },
    { plate: 'EXC-001', vin: 'VIN008', brand: '小松', model: 'PC3000', team: '公司', status: 'active' },
  ],

  fuelRecords: [
    { date: '2024-11-01', time: '08:30', vehicle: 'KAM-001', vehiclePlate: 'KAM-001', liters: 800, team: '公司', location: '矿区加油站' },
    { date: '2024-11-03', time: '09:15', vehicle: 'KAM-002', vehiclePlate: 'KAM-002', liters: 750, team: '公司', location: '矿区加油站' },
    { date: '2024-11-05', time: '10:00', vehicle: 'KAM-003', vehiclePlate: 'KAM-003', liters: 780, team: '公司', location: '矿区加油站' },
    { date: '2024-11-07', time: '08:45', vehicle: 'KAM-004', vehiclePlate: 'KAM-004', liters: 720, team: '公司', location: '矿区加油站' },
    { date: '2024-11-10', time: '11:30', vehicle: 'BULL-001', vehiclePlate: 'BULL-001', liters: 650, team: '公司', location: '矿区加油站' },
    { date: '2024-11-12', time: '09:00', vehicle: 'WAT-001', vehiclePlate: 'WAT-001', liters: 580, team: '公司', location: '矿区加油站' },
    { date: '2024-11-15', time: '10:30', vehicle: 'LOA-001', vehiclePlate: 'LOA-001', liters: 720, team: '公司', location: '矿区加油站' },
    { date: '2024-11-18', time: '08:00', vehicle: 'EXC-001', vehiclePlate: 'EXC-001', liters: 632, team: '公司', location: '矿区加油站' },
  ],

  trips: [
    { date: '2024-11-01', vehicle: 'KAM-001', vehiclePlate: 'KAM-001', driver: '陈刚', shift: '早班', tons: 280, status: 'completed', team: '公司', from: '采矿区A', to: '破碎站', tripCount: 14, notes: '' },
    { date: '2024-11-01', vehicle: 'KAM-002', vehiclePlate: 'KAM-002', driver: '李伟', shift: '早班', tons: 275, status: 'completed', team: '公司', from: '采矿区B', to: '破碎站', tripCount: 13, notes: '' },
    { date: '2024-11-01', vehicle: 'KAM-003', vehiclePlate: 'KAM-003', driver: '王磊', shift: '早班', tons: 270, status: 'completed', team: '公司', from: '采矿区A', to: '破碎站', tripCount: 12, notes: '' },
    { date: '2024-11-02', vehicle: 'KAM-001', vehiclePlate: 'KAM-001', driver: '陈刚', shift: '夜班', tons: 285, status: 'completed', team: '公司', from: '采矿区A', to: '破碎站', tripCount: 15, notes: '' },
    { date: '2024-11-02', vehicle: 'KAM-002', vehiclePlate: 'KAM-002', driver: '李伟', shift: '夜班', tons: 278, status: 'completed', team: '公司', from: '采矿区C', to: '破碎站', tripCount: 14, notes: '' },
    { date: '2024-11-03', vehicle: 'KAM-003', vehiclePlate: 'KAM-003', driver: '郑浩', shift: '早班', tons: 268, status: 'completed', team: '公司', from: '采矿区A', to: '破碎站', tripCount: 11, notes: '' },
  ],

  checklists: [
    {
      date: '2024-11-01', vehicle: 'KAM-001', vehiclePlate: 'KAM-001', driver: '陈刚',
      template: '日常点检', passed: true, team: '公司',
      items: [
        { name: '刹车系统', passed: true },
        { name: '轮胎状况', passed: true },
        { name: '灯光信号', passed: true },
        { name: '后视镜', passed: true },
        { name: '喇叭', passed: true },
        { name: '转向系统', passed: true },
      ],
      notes: '一切正常'
    },
    {
      date: '2024-11-01', vehicle: 'KAM-002', vehiclePlate: 'KAM-002', driver: '李伟',
      template: '日常点检', passed: true, team: '公司',
      items: [
        { name: '刹车系统', passed: true },
        { name: '轮胎状况', passed: true },
        { name: '灯光信号', passed: true },
        { name: '后视镜', passed: true },
        { name: '喇叭', passed: true },
        { name: '转向系统', passed: false },
      ],
      notes: '转向系统有轻微异响'
    },
    {
      date: '2024-11-02', vehicle: 'KAM-003', vehiclePlate: 'KAM-003', driver: '王磊',
      template: '日常点检', passed: true, team: '公司',
      items: [
        { name: '刹车系统', passed: true },
        { name: '轮胎状况', passed: true },
        { name: '灯光信号', passed: true },
        { name: '后视镜', passed: true },
        { name: '喇叭', passed: true },
        { name: '转向系统', passed: true },
      ],
      notes: ''
    },
    {
      date: '2024-11-03', vehicle: 'KAM-004', vehiclePlate: 'KAM-004', driver: '周亮',
      template: '日常点检', passed: false, team: '公司',
      items: [
        { name: '刹车系统', passed: false },
        { name: '轮胎状况', passed: true },
        { name: '灯光信号', passed: true },
        { name: '后视镜', passed: true },
        { name: '喇叭', passed: true },
        { name: '转向系统', passed: true },
      ],
      notes: '刹车气压不足，需要充气'
    },
    {
      date: '2024-11-05', vehicle: 'BULL-001', vehiclePlate: 'BULL-001', driver: '张强',
      template: '日常点检', passed: true, team: '公司',
      items: [
        { name: '刹车系统', passed: true },
        { name: '轮胎状况', passed: true },
        { name: '灯光信号', passed: true },
        { name: '后视镜', passed: true },
        { name: '喇叭', passed: true },
        { name: '转向系统', passed: true },
      ],
      notes: ''
    },
    {
      date: '2024-11-07', vehicle: 'WAT-001', vehiclePlate: 'WAT-001', driver: '孙鹏',
      template: '日常点检', passed: true, team: '公司',
      items: [
        { name: '刹车系统', passed: true },
        { name: '轮胎状况', passed: true },
        { name: '灯光信号', passed: true },
        { name: '后视镜', passed: true },
        { name: '喇叭', passed: true },
        { name: '转向系统', passed: true },
      ],
      notes: ''
    },
  ],

  users: [
    { username: 'admin', name: '管理员', role: '管理员', department: '办公室', employee: 'admin', status: 'active', password: '$2b$10$Z/4plH3wyQAr6Q0wu524IegfkGVhPeu21yNLADZrmzJYif5Ustd1G' },
    { username: 'ft', name: '操作员', role: '操作员', department: '生产技术部', employee: 'ft', status: 'active', password: '$2b$10$Z/4plH3wyQAr6Q0wu524IegfkGVhPeu21yNLADZrmzJYif5Ustd1G' },
  ],
};

async function seed() {
  const conn = await pool.getConnection();
  try {
    // 清空旧数据
    await conn.execute('SET FOREIGN_KEY_CHECKS = 0');
    await conn.execute('TRUNCATE TABLE checklists');
    await conn.execute('TRUNCATE TABLE trips');
    await conn.execute('TRUNCATE TABLE fuel_records');
    await conn.execute('TRUNCATE TABLE vehicles');
    await conn.execute('TRUNCATE TABLE employees');
    await conn.execute('TRUNCATE TABLE departments');
    await conn.execute('TRUNCATE TABLE users');
    await conn.execute('SET FOREIGN_KEY_CHECKS = 1');

    // 插入部门
    for (const d of seedData.departments) {
      await conn.execute(
        'INSERT INTO departments (name, manager, employeeCount, description) VALUES (?, ?, ?, ?)',
        [d.name, d.manager, d.employeeCount, d.description]
      );
    }
    console.log('✅ 部门数据已导入 (8条)');

    // 插入员工
    for (const e of seedData.employees) {
      await conn.execute(
        'INSERT INTO employees (empNo, voterNo, name, nameFr, department, position, gender, phone, team, roomNo, status, nationality, terminatedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [e.empNo, e.voterNo, e.name, e.nameFr, e.department, e.position, e.gender, e.phone, e.team, e.roomNo, e.status, e.nationality, e.terminatedDate || null]
      );
    }
    console.log('✅ 员工数据已导入 (15条)');

    // 插入车辆
    for (const v of seedData.vehicles) {
      await conn.execute(
        'INSERT INTO vehicles (plate, vin, brand, model, team, status) VALUES (?, ?, ?, ?, ?, ?)',
        [v.plate, v.vin, v.brand, v.model, v.team, v.status]
      );
    }
    console.log('✅ 车辆数据已导入 (8条)');

    // 插入加油记录
    for (const f of seedData.fuelRecords) {
      await conn.execute(
        'INSERT INTO fuel_records (date, time, vehicle, vehiclePlate, liters, team, location) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [f.date, f.time, f.vehicle, f.vehiclePlate, f.liters, f.team, f.location]
      );
    }
    console.log('✅ 加油记录已导入 (8条)');

    // 插入行程记录
    for (const t of seedData.trips) {
      await conn.execute(
        'INSERT INTO trips (date, vehicle, vehiclePlate, driver, shift, tons, status, team, `from`, `to`, tripCount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [t.date, t.vehicle, t.vehiclePlate, t.driver, t.shift, t.tons, t.status, t.team, t.from, t.to, t.tripCount, t.notes]
      );
    }
    console.log('✅ 行程记录已导入 (6条)');

    // 插入点检记录
    for (const c of seedData.checklists) {
      await conn.execute(
        'INSERT INTO checklists (date, vehicle, vehiclePlate, driver, template, passed, team, items, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [c.date, c.vehicle, c.vehiclePlate, c.driver, c.template, c.passed, c.team, JSON.stringify(c.items), c.notes]
      );
    }
    console.log('✅ 点检记录已导入 (6条)');

    // 插入用户
    for (const u of seedData.users) {
      await conn.execute(
        'INSERT INTO users (username, name, role, department, employee, status, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [u.username, u.name, u.role, u.department, u.employee, u.status, u.password]
      );
    }
    console.log('✅ 用户数据已导入 (2条)');
    console.log('\n🎉 所有种子数据导入完成！');
    console.log('  账号: admin  / 密码: admin123  (管理员)');
    console.log('  账号: ft     / 密码: admin123  (操作员)');
  } finally {
    conn.release();
  }
}

module.exports = seed;
