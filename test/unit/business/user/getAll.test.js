const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

const UserBO = require('../../../../src/business/userBO');
const DAOFactory = require('../../../../src/factories/factoryDAO');
const DateHelper = require('../../../../src/helpers/dateHelper');
const CryptoHelper = require('../../../../src/helpers/cryptoHelper');

describe('UserBO', () => {
  const daoFactory = new DAOFactory();
  const dateHelper = new DateHelper();
  const cryptoHelper = new CryptoHelper();

  const userDAO = daoFactory.getDAO('USER');

  const userBO = new UserBO({
    userDAO,
    dateHelper,
    cryptoHelper,
  });

  let getAllStub;

  beforeEach(() => {
    getAllStub = sinon.stub(userDAO, 'getAll');
  });

  afterEach(() => {
    getAllStub.restore();
  });

  describe('getAll', () => {
    it('Should return an user', async () => {
      getAllStub
          .withArgs({ email: 'test@email.com' })
          .returns([]);

      const users = await userBO.getAll({ email: 'test@email.com' });
      expect(users).to.be.eql([]);
    });
  });
});
