const jwt = require('jsonwebtoken');

const settings = require('../config/settings');
const logger = require('../config/logger');


class JWTHelper {
  verifyToken(req, res, next) {
    try {
      let { authorization } = req.headers;

      logger.info(`Validating authentication by token: ${token}`);

      if (!authorization || authorization === '') {
        logger.error('[jwtHelper] The token does not exist or is empty');
        const error = {
          message: 'The token does not exist or is empty',
          statusCode: 403,
        };
        throw error;
      } else {
        authorization = authorization.split(' ');
        if (!authorization.length === 2) {
          const error = {
            message: 'The token is badly formatted',
            statusCode: 403,
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
      if (error.code || error.code === 403) {
        res.status(403).json({});
      }
      if (error.message || error.message === 'invalid token') {
        res.status(403).json({});
      };
    }
  }
}

module.exports = JWTHelper;
