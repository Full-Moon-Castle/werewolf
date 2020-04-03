const UserBO = require('../business/userBO');
const LoginBO = require('../business/loginBO');
const DAOFactory = require('./factoryDAO');
const CryptoHelper = require('../helpers/cryptoHelper');
const DateHelper = require('../helpers/dateHelper');
const JwtHelper = require('../helpers/jwtHelper');

class FactoryBO {
  constructor() {
    this.daoFactory = new DAOFactory();
    this.cryptoHelper = new CryptoHelper();
    this.dateHelper = new DateHelper();
    this.jwtHelper = new JwtHelper();
  }

  getBO(name) {
    switch (name) {
      case 'USER':
        return new UserBO({
          userDAO: this.daoFactory.getDAO('USER'),
          cryptoHelper: this.cryptoHelper,
          dateHelper: this.dateHelper,
        });
      case 'LOGIN':
        return new LoginBO({
          userBO: this.getBO('USER'),
          cryptoHelper: this.cryptoHelper,
          jwtHelper: this.jwtHelper,
        });
    }
  }
}

module.exports = FactoryBO;
