const logger = require('../config/logger');


class UserDAO {
  constructor(dependencies) {
    this.dbHelper = dependencies.databaseHelper;
    this.queries = dependencies.queries;
  }

  async create(user) {
    try {
      logger.info('Starting create user in DAO');
      const { nickname, email, password, createdDate } = user;
      const isEnabled = true;

      const query = this.queries.insert;
      const params = [nickname, email, password, isEnabled, createdDate];

      const result = await this.dbHelper.execute(query, params);

      return result;
    } catch (error) {
      logger.error(`An error occurred in DAO: ${error}`);
      throw error;
    }
  }

  async getAll(filters) {
    logger.info('Starting create user in DAO');

    const { email, password, nickname } = filters;

    let query = this.queries.select;
    const params = [];

    if (email) {
      query += ' and email = ?';
      params.push(email);
    }

    if (nickname) {
      query += ' and nickname = ?';
      params.push(nickname);
    }

    if (password) {
      query += ' and password = ?';
      params.push(password);
    }

    const result = await this.dbHelper.execute(query, params);

    return result;
  }

  async update(id, entity) {
    
  }

  async delete(id) {
    try {
      logger.info('Starting delete user in DAO');

      const query = this.queries.delete;

      const params = [id];

      const result = await this.dbHelper.execute(query, params);

      return result;
    } catch (error) {
      logger.error(`An error occurred in DAO: ${error}`);
      throw error;
    }
  }
}

module.exports = UserDAO;
