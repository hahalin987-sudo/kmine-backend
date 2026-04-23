const serverless = require('serverless-http');
const app = require('../server');

// Export the Express app wrapped for Vercel serverless
// No basePath - Express routes already include /api prefix
module.exports = serverless(app);
