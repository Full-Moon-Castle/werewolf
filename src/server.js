const http = require('http');
const ExpressConfig = require('./config/express');

const expressConfig = new ExpressConfig();
const app = expressConfig.getApp();

const server = http.createServer(app).listen(app.get('port'), function() {
  console.log('Express is running on port now ' + app.get('port'));
});

module.exports = server;
