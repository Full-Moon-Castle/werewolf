const jwt = require('jsonwebtoken');

const settings = require('../config/settings');
const logger = require('../config/logger');
const statusCode = require('../helpers/statusHelper');
const Settings = require('../config/settings');


class JWTHelper {
  constructor() {
    this.settings = new Settings();
  }

  verifyToken(req, res, next) {
    try {
      let { authorization } = req.headers;

      logger.info(`Validating authentication by token: ${token}`);

      if (!authorization || authorization === '') {
        logger.error('[jwtHelper] The token does not exist or is empty');
        const error = {
          message: 'The token does not exist or is empty',
          statusCode: statusCode.FORBIDDEN,
        };
        throw error;
      } else {
        authorization = authorization.split(' ');
        if (!authorization.length === 2) {
          const error = {
            message: 'The token is badly formatted',
            statusCode: statusCode.FORBIDDEN,
          };
          throw error;
        }
      }

      jwt.verify(token, settings.jwt.secret, (error, decoded) => {
        if (error) {
          throw error;
        }
        logger.info(`The token is valid with payload token: ${decoded}`);
        next();
      });
    } catch (error) {
      logger.error(`An error occurred: error`);
      if (error.code || error.code === statusCode.FORBIDDEN) {
        res.status(statusCode.FORBIDDEN).json({});
      }
      if (error.message || error.message === 'invalid token') {
        res.status(statusCode.FORBIDDEN).json({});
      };
    }
  }

  createToken(entity) {
    try {
      const { id, email, createdDate } = entity;
      const { jwtSecret, expiresIn } = this.settings.jwt;
      const token = jwt.sign( {
        id,
        email,
        createdDate,
      }, jwtSecret, { expiresIn });

      return token;
    } catch (errors) {
      logger.error(`An error occurred: ${errors}`);
      const error = {
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
      return error;
    }
  }
}

module.exports = JWTHelper;
