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
      if (error.code == 'ECONNREFUSED') {
        const handledError = {
          message: 'An error occurred when try connect in database',
          statusCode: 500,
          error,
        };
        throw handledError;
      }
      throw error;
    }
  }

  async getAll(filters) {
    logger.info('Starting create user in DAO');

    const { email } = filters;

    let query = this.queries.select;
    const params = [];

    if (email) {
      query += 'and email = ?';
      params.push(email);
    }

    const result = await this.dbHelper.execute(query, params);

    return result;
  }
}

module.exports = UserDAO;
