"use strict";
const http = require('http');
const { report } = require('./health');

function ensureJSON(res) {
  res.setHeader('Content-Type', 'application/json');
}

function startHealthServer(port) {
  const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/healthz') {
      ensureJSON(res);
      const payload = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        health: report(),
      };
      res.writeHead(200);
      res.end(JSON.stringify(payload, null, 2));
    } else if (req.url === '/metrics') {
      ensureJSON(res);
      const payload = {
        timestamp: new Date().toISOString(),
        health: report(),
      };
      res.writeHead(200);
      res.end(JSON.stringify(payload, null, 2));
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  server.listen(port, () => {
    console.log(`Health endpoint listening on http://localhost:${port}/health`);
  });

  return server;
}

module.exports = { startHealthServer };
