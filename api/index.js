const serverless = require('serverless-http');
const app = require('../server');

// Export the Express app wrapped for Vercel serverless
module.exports = serverless(app, {
  basePath: '/api'
});
