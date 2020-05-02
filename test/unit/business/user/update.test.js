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

  let updateStub;

  beforeEach(() => {
    updateStub = sinon.stub(userDAO, 'update');
  });

  afterEach(() => {
    updateStub.restore();
  });

  describe('update', () => {
    it('Should return error because id is not a number', async () => {
      try {
        await userBO.update('string', 'string', { avatar: 'avatar' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(409);
        expect(error.message).to.be.equals('The id is not an number');
      }
    });
    it('Should return error because id is not equal userId', async () => {
      try {
        await userBO.update(2, 1, { avatar: 'avatar' });
        expect(0).to.equal(1);
      } catch (error) {
        const { statusCode, message } = error;
        expect(statusCode).to.be.equals(403);
        expect(message)
            .to.be.equals('You are not allowed to update this user.');
      }
    });
    it('Should return success when update user', async () => {
      updateStub
          .withArgs(6, { avatar: 'avatar' })
          .returns({
            statusCode: 200,
            message: 'updated user id: 6',
          });

      const result = await userBO.update(6, 6, { avatar: 'avatar' });
      expect(result.message).to.be.equals('Updated user id: 6');
      expect(updateStub.callCount).to.be.equals(1);
    });
  });
});
