const logger = require('../../config/logger');
const BOFactory = require('../../factories/factoryBO');
const statusCode = require('../../helpers/statusHelper');

class LoginController {
  async login(req, res) {
    try {
      logger.info('Started login a user');
      const factoryBO = new BOFactory();
      logger.info(factoryBO);
      const business = factoryBO.getBO('LOGIN');
      logger.info(business);
      const body = req.body ? req.body: {};
      const response = await business.login(body);
      res.status(statusCode.OK).json(response);
    } catch (error) {
      logger.error('An error occurred when try login a user: %o', error);
      const statusCode = error.statusCode ?
        error.statusCode :
        statusCode.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json(error.message);
    }
  }
}

module.exports = new LoginController;
