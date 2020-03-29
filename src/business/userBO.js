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
          statusCode: 409,
          message: 'Entered email is already being used',
        };
        throw error;
      }

      const encriptedPassword = this.cryptoHelper.encrypt(password);
      const now = this.dateHelper.now();
      const nowString = this.dateHelper.toString(now, 'YYYY-MM-DD HH:mm:ss');

      const entity = {
        nickname,
        email,
        password: encriptedPassword,
        createdDate: nowString,
      };

      const result = await this.dao.create(entity);

      return { message: `User inserted with id ${result.insertId}` };
    } catch (error) {
      logger.error('An error occurred: %o', error);
      throw error;
    }
  }

  verifyUser(entity) {
    logger.info('Verifing entity');
    let error;
    if (!entity || !entity.email) {
      logger.error('Email not found');
      error = { statusCode: 422, message: 'Email is required' };
      throw error;
    }
    if (!entity.nickname) {
      logger.error('Nickname not found');
      error = { statusCode: 422, message: 'Nickname is required' };
      throw error;
    }
    if (!entity.password) {
      logger.error('Password not found');
      error = { statusCode: 422, message: 'Password is required' };
      throw error;
    }
  }

  async verifyEmail(email) {
    logger.info('Verifing if email was already used');


    const filter = {
      email,
    };
    const users = await this.getAll(filter);

    return users.length > 0 ? true : false;
  }

  async getAll(filter) {
    logger.info('Getting all users by filter');
    const users = await this.dao.getAll(filter);
    return users;
  }
}

module.exports = UserBO;
