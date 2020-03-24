const UserDAO = require('../daos/userDAO');

class FactoryDAO {
  getDAO(name) {
    const daos = {
      USER: new UserDAO(),
    };

    return daos[name];
  }
}

module.exports = FactoryDAO;
