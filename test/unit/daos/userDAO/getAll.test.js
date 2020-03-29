const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const UserDAO = require('../../../../src/daos/userDAO');
const DatabaseHelper = require('../../../../src/helpers/databaseHelper');
const queries = require('../../../../src/queries/user.json');

describe('UserDAO', () => {
  const databaseHelper = new DatabaseHelper();

  const userDAO = new UserDAO({
    databaseHelper: databaseHelper,
    queries,
  });

  beforeEach(() => {
    executeStub = sinon.stub(databaseHelper, 'execute');
    date = new Date();
  });

  afterEach(() => {
    executeStub.restore();
  });

  describe('getAll', () => {
    it('Should return an users', async () => {
      executeStub.withArgs(queries.select, []).returns([{}, {}]);

      const users = await userDAO.getAll({});

      expect(users).to.be.eqls([{}, {}]);
      expect(executeStub.callCount).to.be.equal(1);
    });
    it('Should return an users with email\'s email', async () => {
      executeStub
          .withArgs(`${queries.select}and email = ?`, ['test@email.com'])
          .returns([{}]);

      const users = await userDAO.getAll({ email: 'test@email.com' });

      expect(users).to.be.eqls([{}]);
      expect(executeStub.callCount).to.be.equal(1);
    });
  });
});
