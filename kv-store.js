const crypto = require('crypto');

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

var kvClient = null;
var memoryStore = null;

function getKV() {
  if (kvClient) return kvClient;
  
  var kvUrl = process.env.KV_REST_API_URL || '';
  if (!kvUrl) {
    if (!memoryStore) memoryStore = new MemoryStore();
    return memoryStore;
  }
  
  try {
    var createClient = require('@vercel/kv').createClient;
    kvClient = createClient({
      url: kvUrl,
      token: process.env.KV_REST_API_TOKEN || '',
    });
    return kvClient;
  } catch (e) {
    if (!memoryStore) memoryStore = new MemoryStore();
    return memoryStore;
  }
}

class MemoryStore {
  constructor() { this.data = {}; }
  
  async hset(key, field, value) {
    if (!this.data[key]) this.data[key] = {};
    this.data[key][field] = typeof value === 'string' ? value : JSON.stringify(value);
    return 'OK';
  }
  
  async hget(key, field) {
    if (!this.data[key]) return null;
    var val = this.data[key][field];
    try { return JSON.parse(val); } catch (e) { return val; }
  }
  
  async hgetall(key) {
    if (!this.data[key]) return {};
    var result = {};
    var keys = Object.keys(this.data[key]);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = this.data[key][k];
      try { result[k] = JSON.parse(v); } catch (e) { result[k] = v; }
    }
    return result;
  }
  
  async hdel(key) {
    var fields = Array.prototype.slice.call(arguments, 1);
    if (this.data[key]) {
      for (var i = 0; i < fields.length; i++) delete this.data[key][fields[i]];
    }
    return 1;
  }
  
  async del(key) {
    delete this.data[key];
    return 1;
  }

  async incr(key) {
    if (!this.data[key]) this.data[key] = '0';
    this.data[key] = String(parseInt(this.data[key]) + 1);
    return parseInt(this.data[key]);
  }
}

async function getAll(collection) {
  var kv = getKV();
  var all = await kv.hgetall('kmine:' + collection);
  var values = [];
  var keys = Object.keys(all);
  for (var i = 0; i < keys.length; i++) {
    var item = all[keys[i]];
    if (typeof item === 'string') { try { item = JSON.parse(item); } catch (e) {} }
    values.push(item);
  }
  values.sort(function(a, b) { return String(b.id || '').localeCompare(String(a.id || '')); });
  return values;
}

async function getById(collection, id) {
  var kv = getKV();
  return await kv.hget('kmine:' + collection, id);
}

async function add(collection, data) {
  var kv = getKV();
  var id = generateId();
  var record = {};
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) record[keys[i]] = data[keys[i]];
  record.id = id;
  record.createdAt = new Date().toISOString();
  await kv.hset('kmine:' + collection, id, record);
  return record;
}

async function update(collection, id, data) {
  var kv = getKV();
  var existing = await kv.hget('kmine:' + collection, id);
  if (!existing) return null;
  var record = {};
  var eKeys = Object.keys(existing);
  for (var i = 0; i < eKeys.length; i++) record[eKeys[i]] = existing[eKeys[i]];
  var dKeys = Object.keys(data);
  for (var j = 0; j < dKeys.length; j++) record[dKeys[j]] = data[dKeys[j]];
  record.id = id;
  record.updatedAt = new Date().toISOString();
  await kv.hset('kmine:' + collection, id, record);
  return record;
}

async function remove(collection, id) {
  var kv = getKV();
  await kv.hdel('kmine:' + collection, id);
  return true;
}

async function find(collection, filterFn) {
  var items = await getAll(collection);
  var results = [];
  for (var i = 0; i < items.length; i++) {
    if (filterFn(items[i])) results.push(items[i]);
  }
  return results;
}

async function paginate(collection, options) {
  options = options || {};
  var page = options.page || 1;
  var pageSize = options.pageSize || 20;
  var keyword = options.keyword || '';
  var status = options.status || '';
  var department = options.department || '';
  
  var items = await getAll(collection);
  
  if (keyword) {
    var kw = keyword.toLowerCase();
    var filtered = [];
    for (var i = 0; i < items.length; i++) {
      if (JSON.stringify(items[i]).toLowerCase().indexOf(kw) !== -1) filtered.push(items[i]);
    }
    items = filtered;
  }
  if (status) {
    var f2 = [];
    for (var i = 0; i < items.length; i++) { if (items[i].status === status) f2.push(items[i]); }
    items = f2;
  }
  if (department) {
    var f3 = [];
    for (var i = 0; i < items.length; i++) { if (items[i].department === department) f3.push(items[i]); }
    items = f3;
  }
  
  var total = items.length;
  var offset = (page - 1) * pageSize;
  var pagedItems = items.slice(offset, offset + pageSize);
  
  return { items: pagedItems, total: total, page: page, pageSize: pageSize, hasMore: offset + pagedItems.length < total };
}

async function seedAll() {
  var kv = getKV();
  
  var initialized = await kv.hget('kmine:_meta', 'initialized');
  if (initialized) {
    console.log('Database already initialized, skipping seed');
    return;
  }
  
  var seedData = require('./seed-data');
  
  var arr, i;
  arr = seedData.departments; for (i = 0; i < arr.length; i++) await add('departments', arr[i]);
  console.log('Departments seeded: ' + arr.length);
  
  arr = seedData.employees; for (i = 0; i < arr.length; i++) await add('employees', arr[i]);
  console.log('Employees seeded: ' + arr.length);
  
  arr = seedData.vehicles; for (i = 0; i < arr.length; i++) await add('vehicles', arr[i]);
  console.log('Vehicles seeded: ' + arr.length);
  
  arr = seedData.fuelRecords; for (i = 0; i < arr.length; i++) await add('fuel_records', arr[i]);
  console.log('Fuel records seeded: ' + arr.length);
  
  arr = seedData.trips; for (i = 0; i < arr.length; i++) await add('trips', arr[i]);
  console.log('Trips seeded: ' + arr.length);
  
  arr = seedData.checklists; for (i = 0; i < arr.length; i++) await add('checklists', arr[i]);
  console.log('Checklists seeded: ' + arr.length);
  
  arr = seedData.users; for (i = 0; i < arr.length; i++) await add('users', arr[i]);
  console.log('Users seeded: ' + arr.length);
  
  await kv.hset('kmine:_meta', 'initialized', true);
  await kv.hset('kmine:_meta', 'initTime', new Date().toISOString());
  
  console.log('\nAll seed data imported!');
  console.log('  admin / admin123 (Admin)');
  console.log('  ft / admin123 (Operator)');
}

module.exports = {
  generateId: generateId,
  getKV: getKV,
  getAll: getAll,
  getById: getById,
  add: add,
  update: update,
  remove: remove,
  find: find,
  paginate: paginate,
  seedAll: seedAll,
  MemoryStore: MemoryStore
};