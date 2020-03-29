const express = require('express');
const load = require('express-load');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const appSettings = require('./settings');

class ExpressConfig {
  constructor() {
    const app = express();

    app.set('port', appSettings.servicePort);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use((_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    });

    load('controllers', { cwd: 'src/api' })
        .then('routes')
        .into(app);

    this.app = app;
  }

  getApp() {
    return this.app;
  }
}

module.exports = ExpressConfig;
