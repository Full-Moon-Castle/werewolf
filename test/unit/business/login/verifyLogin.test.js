const chai = require('chai');
const expect = chai.expect;

const UserBO = require('../../../../src/business/userBO');
const LoginBO = require('../../../../src/business/loginBO');
const CryptoHelper = require('../../../../src/helpers/cryptoHelper');
const JwtHelper = require('../../../../src/helpers/jwtHelper');
const DAOFactory = require('../../../../src/factories/factoryDAO');
const DateHelper = require('../../../../src/helpers/dateHelper');


describe('LoginBO', () => {

  const loginBO = new LoginBO({

  });

  describe('verifyLogin', () => {
    it('Should return error when there is not a body', async () => {
      try {
        await loginBO.verifyLogin();
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
      }
    });

    it('Should return error when there is not a email', async () => {
      try {
        await loginBO.verifyLogin({ password: '123' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
      }
    });

    it('Should return error when there is not a password', async () => {
      try {
        await loginBO.verifyLogin({ email: 'test@email.com' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Password is required');
      }
    });

    it('Should return a login when entity is correct', async () => {
      const result = await loginBO.verifyLogin({
        email: 'test@email.com',
        password: 'test',
      });

      expect(result).to.be.equals(true);
    });
  });
});
