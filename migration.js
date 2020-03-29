const mysql = require('mysql');
const migration = require('mysql-migrations');
const Settings = require('./src/config/settings');

const settings = new Settings();
const { host, user, password, database } = settings.database;

const connection = mysql.createPool({
  connectionLimit: 10,
  host: host,
  user: user,
  password: password,
  database: database,
});

migration.init(connection, __dirname + '/migrations');
