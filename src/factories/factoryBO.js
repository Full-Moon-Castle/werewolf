const UserBO = require('../business/userBO');
const DAOFactory = require('./factoryDAO');
const CryptoHelper = require('../helpers/cryptoHelper');
const DateHelper = require('../helpers/dateHelper');

class FactoryBO {
  constructor() {
    const daoFactory = new DAOFactory();
    this.userDAO = daoFactory.getDAO('USER');
    this.cryptoHelper = new CryptoHelper();
    this.dateHelper = new DateHelper();
  }

  getBO(name) {
    const business = {
      USER: new UserBO({
        userDAO: this.userDAO,
        cryptoHelper: this.cryptoHelper,
        dateHelper: this.dateHelper,
      }),
    };

    return business[name];
  }
}

module.exports = FactoryBO;
