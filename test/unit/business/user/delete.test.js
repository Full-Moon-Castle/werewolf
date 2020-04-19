const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

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

  let deleteStub;

  beforeEach(() => {
    deleteStub = sinon.stub(userDAO, 'delete');
  });

  afterEach(() => {
    deleteStub.restore();
  });

  describe('delete', () => {
    it('Should return error because id is not a number', async () => {
      deleteStub.withArgs('string').throws({
        statusCode: 409,
        message: 'The id is not an number',
      });

      try {
        await userBO.delete('string');
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(409);
        expect(error.message).to.be.equals('The id is not an number');
      }
    });
    it('Should return success when deleting user', async () => {
      deleteStub.withArgs(6).returns({
        statusCode: 200,
        message: 'Deleted user id: 6',
      });
      await userBO.delete(6);
    });
  });
});
