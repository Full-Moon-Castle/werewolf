const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const UserBO = require('../../../src/business/userBO');
const DAOFactory = require('../../../src/factories/factoryDAO');
const DateHelper = require('../../../src/helpers/dateHelper');
const CryptoHelper = require('../../../src/helpers/cryptoHelper');

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

  let nowStub;
  let date;
  let createStub;
  let encodeTokenStub;
  let verifyEmailStub;
  let verifyUserStub;

  beforeEach(() => {
    verifyUserStub = sinon.stub(userBO, 'verifyUser');
    nowStub = sinon.stub(dateHelper, 'now');
    toStringStub = sinon.stub(dateHelper, 'toString');
    createStub = sinon.stub(userDAO, 'create');
    encodeTokenStub = sinon.stub(cryptoHelper, 'encrypt');
    verifyEmailStub = sinon.stub(userBO, 'verifyEmail');
    date = new Date();
    nowStub.returns(date);
  });

  afterEach(() => {
    verifyUserStub.restore();
    nowStub.restore();
    createStub.restore();
    encodeTokenStub.restore();
    verifyEmailStub.restore();
    toStringStub.restore();
  });

  describe('create', () => {
    it('Should return error when there is not a body', async () => {
      verifyUserStub.withArgs(undefined).throws({
        statusCode: 422,
        message: 'Email is required',
      });

      try {
        await userBO.create();
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
        expect(verifyUserStub.callCount).to.be.equals(1);
        expect(createStub.callCount).to.be.equals(0);
        expect(encodeTokenStub.callCount).to.be.equals(0);
        expect(nowStub.callCount).to.be.equals(0);
        expect(verifyEmailStub.callCount).to.be.equals(0);
        expect(toStringStub.callCount).to.be.equals(0);
      }
    });
    it('Should return error when body is empty', async () => {
      verifyUserStub.withArgs({}).throws({
        statusCode: 422,
        message: 'Email is required',
      });

      try {
        await userBO.create({});
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
        expect(verifyUserStub.callCount).to.be.equals(1);
        expect(createStub.callCount).to.be.equals(0);
        expect(encodeTokenStub.callCount).to.be.equals(0);
        expect(nowStub.callCount).to.be.equals(0);
        expect(verifyEmailStub.callCount).to.be.equals(0);
        expect(toStringStub.callCount).to.be.equals(0);
      }
    });
    it('Should return error when body not contains email', async () => {
      verifyUserStub
          .withArgs({ password: 'test' })
          .throws({
            statusCode: 422,
            message: 'Email is required',
          });

      try {
        await userBO.create({ password: 'test' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
        expect(verifyUserStub.callCount).to.be.equals(1);
        expect(createStub.callCount).to.be.equals(0);
        expect(encodeTokenStub.callCount).to.be.equals(0);
        expect(nowStub.callCount).to.be.equals(0);
        expect(verifyEmailStub.callCount).to.be.equals(0);
        expect(toStringStub.callCount).to.be.equals(0);
      }
    });
    it('Should return error when body not contains name', async () => {
      verifyUserStub
          .withArgs({ email: 'test@email.com', password: 'test' })
          .throws({ statusCode: 422, message: 'Name is required' });

      try {
        await userBO.create({ email: 'test@email.com', password: 'test' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Name is required');
        expect(verifyUserStub.callCount).to.be.equals(1);
        expect(createStub.callCount).to.be.equals(0);
        expect(encodeTokenStub.callCount).to.be.equals(0);
        expect(nowStub.callCount).to.be.equals(0);
        expect(verifyEmailStub.callCount).to.be.equals(0);
        expect(toStringStub.callCount).to.be.equals(0);
      }
    });
    it('Should return error when body not contains password', async () => {
      verifyUserStub
          .withArgs({ email: 'test@email.com', name: 'test' })
          .throws({ statusCode: 422, message: 'Password is required' });

      try {
        await userBO.create({ email: 'test@email.com', name: 'test' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Password is required');
        expect(verifyUserStub.callCount).to.be.equals(1);
        expect(createStub.callCount).to.be.equals(0);
        expect(encodeTokenStub.callCount).to.be.equals(0);
        expect(nowStub.callCount).to.be.equals(0);
        expect(verifyEmailStub.callCount).to.be.equals(0);
        expect(toStringStub.callCount).to.be.equals(0);
      }
    });
    it('Should return a user when entity is correct', async () => {
      const encryptedPassword = 'efb0d7fc366e9d3df96b0e9';

      verifyUserStub
          .withArgs({
            email: 'test@email.com',
            nickname: 'test',
            password: '123',
          })
          .returns();

      verifyEmailStub
          .withArgs('test@emailtest.com')
          .returns(false);

      encodeTokenStub
          .withArgs('test')
          .returns(encryptedPassword);

      toStringStub
          .withArgs(date, 'YYYY-MM-DD HH:mm:ss')
          .returns('2020-03-28 23:04:14');

      createStub
          .withArgs({
            email: 'test@email.com',
            nickname: 'test',
            password: encryptedPassword,
            createdDate: '2020-03-28 23:04:14',
          })
          .returns({
            insertId: 1,
          });

      await userBO.create({
        email: 'test@email.com',
        nickname: 'test',
        password: 'test',
      });

      expect(verifyUserStub.callCount).to.be.equals(1);
      expect(verifyEmailStub.callCount).to.be.equals(1);
      expect(createStub.callCount).to.be.equals(1);
      expect(encodeTokenStub.callCount).to.be.equals(1);
      expect(nowStub.callCount).to.be.equals(1);
      expect(toStringStub.callCount).to.be.equals(1);
    });
    it('Should return a error when email is already being used', async () => {
      verifyUserStub
          .withArgs({
            email: 'test@email.com',
            name: 'test',
            password: '123',
          })
          .returns();

      verifyEmailStub
          .withArgs('test@email.com')
          .returns(true);

      try {
        await userBO.create({
          email: 'test@email.com',
          name: 'test',
          password: '123',
        });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.eqls(409);
        expect(error.message)
            .to.be.equals('Entered email is already being used');
        expect(verifyUserStub.callCount).to.be.equals(1);
        expect(verifyEmailStub.callCount).to.be.equals(1);
        expect(createStub.callCount).to.be.equals(0);
        expect(encodeTokenStub.callCount).to.be.equals(0);
        expect(nowStub.callCount).to.be.equals(0);
      }
    });
  });
});
