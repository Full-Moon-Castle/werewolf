const logger = require('../config/logger');


class UserBO {
  async create(body) {
    try {
      await this.verifyUser(body);
    } catch (error) {
      throw error;
    }
  }

  verifyUser(body) {
    let error;
    if (!body || !body.email) {
      logger.error('Email not found');
      error = { code: 422, message: 'Email are required' };
      throw error;
    }
    if (!body.name) {
      logger.error('Name not found');
      error = { code: 422, message: 'Name are required' };
      throw error;
    }
    if (!body.password) {
      logger.error('Password not found');
      error = { code: 422, message: 'Password are required' };
      throw error;
    }
  }
}

module.exports = UserBO;
