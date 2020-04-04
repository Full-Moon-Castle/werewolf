const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const FactoryBO = require('../../../../src/factories/factoryBO');
const JwtHelper = require('../../../../src/helpers/jwtHelper');
const CryptoHelper = require('../../../../src/helpers/cryptoHelper');
const LoginBO = require('../../../../src/business/loginBO');


describe('LoginBO', () => {
  const factoryBO = new FactoryBO();
  const jwtHelper = new JwtHelper();
  const cryptoHelper = new CryptoHelper();
  const userBO = factoryBO.getBO('USER');

  const loginBO = new LoginBO({ userBO, jwtHelper, cryptoHelper });

  let verifyLoginStub;
  let getAllStub;

  beforeEach(() => {
    verifyLoginStub = sinon.stub(loginBO, 'verifyLogin');
    getAllStub = sinon.stub(userBO, 'getAll');
    encryptStub = sinon.stub(cryptoHelper, 'encrypt');
    jwtHelperStub = sinon.stub(jwtHelper, 'createToken');
  });

  afterEach(() => {
    verifyLoginStub.restore();
    getAllStub.restore();
    encryptStub.restore();
    jwtHelperStub.restore();
  });

  describe('login', () => {
    it('Should return error when there is not a body', async () => {
      try {
        verifyLoginStub.withArgs().throws({ statusCode:
          422,
        message: 'Email is required',
        });
        await loginBO.login();
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
        expect(verifyLoginStub.callCount).to.be.equal(1);
        expect(getAllStub.callCount).to.be.equal(0);
        expect(encryptStub.callCount).to.be.equal(0);
        expect(jwtHelperStub.callCount).to.be.equal(0);
      }
    });

    it('Should return error when there is not a email', async () => {
      try {
        verifyLoginStub
            .withArgs({ email: '', password: '1234' })
            .throws({ statusCode: 422, message: 'Email is required' });
        await loginBO.login( { email: '', password: '1234' } );
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Email is required');
        expect(verifyLoginStub.callCount).to.be.equal(1);
        expect(getAllStub.callCount).to.be.equal(0);
        expect(encryptStub.callCount).to.be.equal(0);
        expect(jwtHelperStub.callCount).to.be.equal(0);
      }
    });

    it('Should return error when there is not a password', async () => {
      try {
        verifyLoginStub
            .withArgs({ email: 'teste@test.com', password: '' })
            .throws({ statusCode: 422, message: 'Passord is required' });
        await loginBO.login( { email: 'teste@test.com', password: '' } );
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(422);
        expect(error.message).to.be.equals('Passord is required');
        expect(verifyLoginStub.callCount).to.be.equal(1);
        expect(getAllStub.callCount).to.be.equal(0);
        expect(encryptStub.callCount).to.be.equal(0);
        expect(jwtHelperStub.callCount).to.be.equal(0);
      }
    });

    it('Should return error when there is not user registered', async () => {
      try {
        verifyLoginStub.withArgs({ email: 'teste@test.com', password: '123' })
            .returns(true);
        encryptStub.withArgs('123').returns('126r26562');
        getAllStub.withArgs({ email: 'teste@test.com',
          password: '126r26562' }).returns([]);

        await loginBO.login({ email: 'teste@test.com', password: '123' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(401);
        expect(error.message).to.be.equals('Incorrect email or password!');
        expect(verifyLoginStub.callCount).to.be.equal(1);
        expect(getAllStub.callCount).to.be.equal(1);
        expect(encryptStub.callCount).to.be.equal(1);
        expect(jwtHelperStub.callCount).to.be.equal(0);
      }
    });

    it('Should return error when there is not create token', async () => {
      try {
        verifyLoginStub
            .withArgs({ email: 'teste@test.com', password: '123' })
            .returns(true);
        encryptStub.withArgs('123').returns('126r26562');
        getAllStub
            .withArgs({ email: 'teste@test.com', password: '126r26562' })
            .returns([{}]);
        jwtHelperStub.withArgs({})
            .throws({ statusCode: 500, message: 'Internal server error' });

        await loginBO.login({ email: 'teste@test.com', password: '123' });
        expect(0).to.equal(1);
      } catch (error) {
        expect(error.statusCode).to.be.equals(500);
        expect(error.message).to.be.equals('Internal server error');
        expect(verifyLoginStub.callCount).to.be.equal(1);
        expect(getAllStub.callCount).to.be.equal(1);
        expect(encryptStub.callCount).to.be.equal(1);
        expect(jwtHelperStub.callCount).to.be.equal(1);
      }
    });

    it('Should return a user with token when login was success', async () => {
      verifyLoginStub
          .withArgs({ email: 'teste@test.com', password: '1234' })
          .returns(true);
      encryptStub.withArgs('1234').returns('126r26562');
      getAllStub.withArgs({ email: 'teste@test.com',
        password: '126r26562' })
          .returns(
              [{ id: 1,
                avatar: null,
                email: 'test@email.com',
                is_enabled: 1,
                created_date: '2020-03-31T02:14:43.000Z',
              }]);
      jwtHelperStub
          .withArgs(
              { id: 1,
                avatar: null,
                email: 'test@email.com',
                is_enabled: 1,
                created_date: '2020-03-31T02:14:43.000Z',
              }).returns('1187287287282');

      const user = await loginBO.login({ email: 'teste@test.com',
        password: '1234' });
      expect(user)
          .eqls(
              {
                id: 1,
                avatar: null,
                email: 'test@email.com',
                is_enabled: 1,
                created_date: '2020-03-31T02:14:43.000Z',
                token: '1187287287282',
              });
      expect(verifyLoginStub.callCount).to.be.equal(1);
      expect(getAllStub.callCount).to.be.equal(1);
      expect(encryptStub.callCount).to.be.equal(1);
      expect(jwtHelperStub.callCount).to.be.equal(1);
    });
  });
});
