const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const UserBO = require('../../../src/business/userBO');
const DAOFactory = require('../../../src/factories/factoryDAO');
const DateHelper = require('../../../src/helpers/dateHelper');
const CryptoHelper = require('../../../src/helpers/cryptoHelper');

describe('userBO', () => {
  const daoFactory = new DAOFactory();
  const dateHelper = new DateHelper();
  const cryptoHelper = new CryptoHelper();

  const userDAO = daoFactory.getDAO('USER');

  const userBO = new UserBO({
    userDAO,
    dateHelper,
  });

  let nowStub;
  let date;
  let createStub;
  let encodeTokenStub;

  beforeEach(() => {
    nowStub = sinon.stub(dateHelper, 'now');
    createStub = sinon.stub(userDAO, 'create');
    encodeTokenStub = sinon.stub(cryptoHelper, 'encrypt');
    date = new Date();
    nowStub.returns(date);
  });

  afterEach(() => {
    nowStub.restore();
    createStub.restore();
  });

  describe('create', () => {
    it('Should return error when there is not a body', async () => {
      try {
        await userBO.create();
      } catch (error) {
        expect(error.code).to.be.equals(422);
        expect(error.message).to.be.equals('Email are required');
        expect(createStub.callCount).to.be.equals(0);
        expect(encodeTokenStub.callCount).to.be.equals(0);
        expect(nowStub.callCount).to.be.equals(0);
      }
    });
  });
});
