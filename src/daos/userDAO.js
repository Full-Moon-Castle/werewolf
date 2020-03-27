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

      await this.dbHelper.execute(query, params);

      return 'User inserted with success';
    } catch (error) {
      logger.error(`An error occured in DAO: ${error}`);
      throw error;
    }
  }
}

module.exports = UserDAO;
