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
    getAllStub = sinon.stub(userBO, 'getAll');
  });

  afterEach(() => {
    getAllStub.restore();
  });

  describe('verifyNickname', () => {
    it('Should return true when nickname already used', async () => {
      getAllStub
          .withArgs({ nickname: 'test' })
          .returns([{}]);

      const isUsed = await userBO.verifyNickname('test');
      expect(isUsed).to.be.equal(true);
    });
    it('Should return false when nickname is new', async () => {
      getAllStub
          .withArgs({ nickname: 'test' })
          .returns([]);
      const isUsed = await userBO.verifyNickname('test');
      expect(isUsed).to.be.equal(false);
    });
  });
});
