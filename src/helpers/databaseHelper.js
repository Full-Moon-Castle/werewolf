const mysql = require('mysql');
const util = require('util');

const logger = require('../config/logger');
const Settings = require('../config/settings');

class DatabaseHelper {
  constructor() {
    const settings = new Settings();

    const { host, user, password, database } = settings.database;

    const connection = mysql.createConnection({
      host,
      user,
      password,
      database,
    });

    this.connection = connection;
    this.query = util.promisify(connection.query).bind(connection);
  }

  async closeConnection() {
    this.connection.end();
  }

  async execute(query, parameters) {
    try {
      logger.info('Running query in database');
      const result = await this.query(query, parameters);
      return result;
    } catch (error) {
      logger.error(`An error occurred: ${error}`);
      throw error;
    }
  }
}

module.exports = DatabaseHelper;
