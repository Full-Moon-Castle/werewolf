const logger = require('../../config/logger');
const BOFactory = require('../../factories/factoryBO');

class UserController {
  async create(req, res) {
    try {
      logger.info('Started create a user');
      const factoryBO = new BOFactory();
      const business = factoryBO.getBO('USER');
      const body = req.body ? req.body: {};
      const response = await business.create(body);
      res.status(201).json(response);
    } catch (error) {
      logger.error('An error occurred when try create a user: %o', error);
      const statusCode = error.statusCode ? error.statusCode : 500;
      res.status(statusCode).json(error.message);
    }
  }
}

module.exports = new UserController;
