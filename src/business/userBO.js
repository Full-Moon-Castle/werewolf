const logger = require('../config/logger');
const statusCode = require('../helpers/statusHelper');

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
      const isUsedNickName = await this.verifyNickName(nickname);

      if (isUsed) {
        const error = {
          statusCode: statusCode.CONFLICT,
          message: 'Entered email is already being used',
        };
        throw error;
      }

      if (isUsedNickName) {
        const error = {
          statusCode: statusCode.CONFLICT,
          message: 'Entered nick name is already being used',
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

  async delete(id) {
    try {
      logger.info('Starting delete');

      if (isNaN(id)) {
        const error = {
          statusCode: statusCode.CONFLICT,
          message: 'The id is not an number',
        };
        throw error;
      }

      await this.dao.delete(id);

      return { message: `Deleted user id: ${id}` };
    } catch (error) {
      logger.error('An error occurred: %o', error);
      throw error;
    }
  }

  verifyUser(entity) {
    logger.info('Verifing entity');
    let error;

    if (!entity || !entity.email || entity.email.trim().length === 0) {
      logger.error('Email not found');
      error = {
        statusCode: statusCode.UNPROCESSABLE_ENTITY,
        message: 'Email is required',
      };
      throw error;
    }
    if (!entity.nickname || entity.nickname.trim().length === 0) {
      logger.error('Nickname not found');
      error = {
        statusCode: statusCode.UNPROCESSABLE_ENTITY,
        message: 'Nickname is required',
      };
      throw error;
    }
    if (!entity.password || entity.password.trim().length === 0) {
      logger.error('Password not found');
      error = {
        statusCode: statusCode.UNPROCESSABLE_ENTITY,
        message: 'Password is required',
      };
      throw error;
    }
    return true;
  }

  async verifyEmail(email) {
    logger.info('Verifing if email was already used');

    const filter = {
      email,
    };
    const users = await this.getAll(filter);

    return users.length > 0 ? true : false;
  }

  async verifyNickName(nickname) {
    logger.info('Verifing if nick name was already used');

    const filter = {
      nickname,
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
