const UserDAO = require('../daos/userDAO');
const DatabaseHelper = require('../helpers/databaseHelper');
const queries = require('../queries/user.json');


class FactoryDAO {
  getDAO(name) {
    const databaseHelper = new DatabaseHelper();
    const daos = {
      USER: new UserDAO({
        databaseHelper,
        queries,
      }),
    };

    return daos[name];
  }
}

module.exports = FactoryDAO;
