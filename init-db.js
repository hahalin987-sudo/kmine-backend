const pool = require('./db');

async function initDB() {
  const conn = await pool.getConnection();

  try {
    // 员工表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        empNo VARCHAR(20) NOT NULL UNIQUE,
        voterNo VARCHAR(20),
        name VARCHAR(50) NOT NULL,
        nameFr VARCHAR(100),
        department VARCHAR(50),
        position VARCHAR(50),
        gender VARCHAR(10),
        phone VARCHAR(30),
        team ENUM('合作单位','公司') DEFAULT '公司',
        roomNo VARCHAR(20),
        status ENUM('active','on_leave','terminated') DEFAULT 'active',
        nationality VARCHAR(50),
        terminatedDate DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 车辆表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plate VARCHAR(30) NOT NULL UNIQUE,
        vin VARCHAR(50),
        brand VARCHAR(50),
        model VARCHAR(50),
        team ENUM('合作单位','公司') DEFAULT '公司',
        status ENUM('active','maintenance','inactive') DEFAULT 'active',
        createdBy VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 部门表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        manager VARCHAR(50),
        employeeCount INT DEFAULT 0,
        description VARCHAR(200),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 加油记录表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS fuel_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        time VARCHAR(10),
        vehicle VARCHAR(30) NOT NULL,
        vehiclePlate VARCHAR(30),
        liters DECIMAL(10,2) NOT NULL,
        team ENUM('合作单位','公司') DEFAULT '公司',
        location VARCHAR(100),
        createdBy VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 行程记录表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        vehicle VARCHAR(30) NOT NULL,
        vehiclePlate VARCHAR(30),
        driver VARCHAR(50),
        shift ENUM('早班','夜班','') DEFAULT '早班',
        tons DECIMAL(10,2),
        status ENUM('completed','in_progress','cancelled') DEFAULT 'completed',
        notes TEXT,
        team ENUM('合作单位','公司') DEFAULT '公司',
        \`from\` VARCHAR(100),
        \`to\` VARCHAR(100),
        tripCount INT,
        createdBy VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 点检记录表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS checklists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        vehicle VARCHAR(30) NOT NULL,
        vehiclePlate VARCHAR(30),
        driver VARCHAR(50),
        template ENUM('日常点检','周检','月检') DEFAULT '日常点检',
        passed BOOLEAN DEFAULT TRUE,
        team ENUM('合作单位','公司') DEFAULT '公司',
        items JSON,
        notes TEXT,
        createdBy VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 用户表
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(50),
        role ENUM('管理员','部门经理','操作员','访客') DEFAULT '操作员',
        department VARCHAR(50),
        employee VARCHAR(50),
        status ENUM('active','on_leave','terminated','maintenance','inactive') DEFAULT 'active',
        password VARCHAR(200) NOT NULL,
        permissions JSON,
        wxOpenId VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ 所有数据表创建完成');
  } finally {
    conn.release();
  }
}

module.exports = initDB;
