const logger = require('../config/logger');


class UserBO {
  constructor(dependencies) {
    this.dao = dependencies.userDAO;
    this.cryptoHelper = dependencies.cryptoHelper;
    this.dateHelper = dependencies.dateHelper;
  }

  async create(body) {
    try {
      logger.info('Starting create');

      this.verifyUser(body);

      const { nickname, email, password } = body;
      const isUsed = await this.verifyEmail(email);

      if (isUsed) {
        const error = {
          code: 409,
          message: 'Entered email is already being used',
        };
        throw error;
      }

      const encriptedPassword = this.cryptoHelper.encrypt(password);
      const now = this.dateHelper.now();

      const entity = {
        nickname,
        email,
        password: encriptedPassword,
        createdDate: now,
      };

      const user = await this.dao.create(entity);

      return user;
    } catch (error) {
      logger.error(`An error occurred: ${error}`);
      throw error;
    }
  }

  verifyUser(entity) {
    logger.info('Verifing entity');
    let error;
    if (!entity || !entity.email) {
      logger.error('Email not found');
      error = { code: 422, message: 'Email are required' };
      throw error;
    }
    if (!entity.nickname) {
      logger.error('Nickname not found');
      error = { code: 422, message: 'Name are required' };
      throw error;
    }
    if (!entity.password) {
      logger.error('Password not found');
      error = { code: 422, message: 'Password are required' };
      throw error;
    }
  }

  verifyEmail() {}

  getAll() {}
}

module.exports = UserBO;
