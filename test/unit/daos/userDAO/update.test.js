const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const UserDAO = require('../../../../src/daos/userDAO');
const DatabaseHelper = require('../../../../src/helpers/databaseHelper');
const queries = require('../../../../src/queries/user.json');

describe('UserDAO', () => {
  const databaseHelper = new DatabaseHelper();

  const userDAO = new UserDAO({
    databaseHelper: databaseHelper,
    queries,
  });

  beforeEach(() => {
    executeStub = sinon.stub(databaseHelper, 'execute');
  });

  afterEach(() => {
    executeStub.restore();
  });

  describe('update', () => {
    it('Should return a message error when occurred an error on update',
        async () => {
          executeStub
              .withArgs(
                  queries.update,
                  ['avatar', 1],
              )
              .throws({ error: 'An error occurred' });

          try {
            await userDAO.update(1, 'avatar');
            expect(0).equal(1);
          } catch (error) {
            expect(error).to.be.eql({ error: 'An error occurred' });
            expect(executeStub.callCount).to.be.equal(1);
          }
        });
  });
  it('Should update user\'s avatar',
      async () => {
        executeStub
            .withArgs(
                queries.update,
                ['avatar', 1],
            )
            .returns({
              changedRows: 1,
            });

        const message = await userDAO.update(1, 'avatar');

        expect(message).to.be.eqls({ changedRows: 1 });
        expect(executeStub.callCount).to.be.equal(1);
      });
});
