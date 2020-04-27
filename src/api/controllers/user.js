const logger = require('../../config/logger');
const BOFactory = require('../../factories/factoryBO');
const statusCode = require('../../helpers/statusHelper');

class UserController {
  async create(req, res) {
    try {
      logger.info('Started create a user');
      const factoryBO = new BOFactory();
      const business = factoryBO.getBO('USER');
      const body = req.body ? req.body: {};
      const response = await business.create(body);
      res.status(statusCode.CREATED).json(response);
    } catch (error) {
      logger.error('An error occurred when try create a user: %o', error);
      const statusCode = error.statusCode ?
        error.statusCode :
        statusCode.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json(error.message);
    }
  }

  async delete(req, res, next) {
    try {
      logger.info('Started delete a user');
      const factoryBO = new BOFactory();
      const business = factoryBO.getBO('USER');
      const id = req.params.id ? req.params.id: null;
      const response = await business.delete(id, res.decoded.id);
      res.status(statusCode.OK).json(response);
    } catch (error) {
      const statusCode = error.statusCode ?
        error.statusCode :
        statusCode.INTERNAL_SERVER_ERROR;
      res.status(statusCode).json(error.message);
    }
  }
}

module.exports = new UserController;
