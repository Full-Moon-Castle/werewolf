const logger = require('../config/logger');
const statusCode = require('../helpers/statusHelper');

class LoginBO {
  constructor(dependencies) {
    this.userBO = dependencies.userBO;
    this.cryptoHelper = dependencies.cryptoHelper;
    this.jwtHelper = dependencies.jwtHelper;
  }

  verifyLogin(entity) {
    logger.info('Verifing entity');
    if (!entity || !entity.email) {
      logger.error('Email not found');
      const error = {
        statusCode: statusCode.UNPROCESSABLE_ENTITY,
        message: 'Email is required',
      };
      throw error;
    }
    if (!entity.password) {
      logger.error('Password not found');
      const error = {
        statusCode: statusCode.UNPROCESSABLE_ENTITY,
        message: 'Password is required',
      };
      throw error;
    }
    return true;
  }

  async login(body) {
    try {
      logger.info('Starting verify login');

      this.verifyLogin(body);

      const { email, password } = body;
      const encriptedPassword = this.cryptoHelper.encrypt(password);

      const filter = {
        email,
        password: encriptedPassword,
      };

      const result = await this.userBO.getAll(filter);

      if (result.length === 0) {
        logger.error('Incorrect email or password');

        const error = {
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Incorrect email or password!',
        };

        throw error;
      }

      const token = this.jwtHelper.createToken(result[0]);

      result[0].token = token;

      return result[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LoginBO;
