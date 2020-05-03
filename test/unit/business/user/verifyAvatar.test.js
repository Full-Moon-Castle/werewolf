const chai = require('chai');
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

  describe('verifyAvatar', () => {
    it('Should return error when avatar is null', async () => {
      try {
        await userBO.verifyAvatar(null);
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Avatar cannot be empty or null');
      }
    });
    it('Should return error when body is empty', async () => {
      try {
        await userBO.verifyAvatar('');
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Avatar cannot be empty or null');
      }
    });
    it('Should return error when avatar is not a String', async () => {
      try {
        await userBO.verifyAvatar(5);
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Avatar must be a String');
      }
    });
    it('Should return a user when avatar is correct', async () => {
      const result = await userBO.verifyAvatar('avatar');

      expect(result).to.be.equals(true);
    });
  });
});
