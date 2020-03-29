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

  describe('verifyUser', () => {
    it('Should return error when there is not a body', async () => {
      try {
        await userBO.verifyUser();
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
      }
    });
    it('Should return error when body is empty', async () => {
      try {
        await userBO.create({});
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
      }
    });
    it('Should return error when body not contains email', async () => {
      try {
        await userBO.create({ password: 'test' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
      }
    });
    it('Should return error when body not contains nickname', async () => {
      try {
        await userBO.verifyUser({ email: 'test@email.com', password: 'test' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Nickname is required');
      }
    });
    it('Should return error when body not contains password', async () => {
      try {
        await userBO.verifyUser({ email: 'test@email.com', nickname: 'test' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Password is required');
      }
    });
    it('Should return a user when entity is correct', async () => {
      const result = await userBO.verifyUser({
        email: 'test@email.com',
        nickname: 'test',
        password: 'test',
      });

      expect(result).to.be.equals(true);
    });
  });
});
