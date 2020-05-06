const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const server = require('../../src/server');

describe('users', () => {
  let validToken;
  let userId;
  after(() => {
    server.close();
  });

  describe('v1/users', () => {
    describe('POST', () => {
      it('Should return error because body is empty', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({})
            .expect(422);
      });

      it('Should return error because email does not exist', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ nickname: 'test', password: '123' })
            .expect(422);
      });

      it('Should return error because email is empty', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ email: ' ', nickname: 'test', password: '123' })
            .expect(422);
      });

      it('Should return error because nickname is empty', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ email: 'test@email.com', nickname: ' ', password: '123' })
            .expect(422);
      });

      it('Should return error because password is empty', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ email: 'test@email.com', nickname: 'test', password: ' ' })
            .expect(422);
      });

      it('Should return error because nickname does not exist', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ email: 'test@email.com', password: '123' })
            .expect(422);
      });
      it('Should return error because password does not exist', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ email: 'test@email.com', nickname: 'test' })
            .expect(422);
      });
      it('Should return user with valid entity', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
              email: 'test@email.com',
              nickname: 'test',
              password: '1234',
            })
            .expect(201)
            .then((response) => {
              expect(response.body.message).contains('User inserted with id');
            });
      });
      it('Should return error because email already exist', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
              email: 'test@email.com',
              nickname: 'test',
              password: '1234',
            })
            .expect(409);
      });
      it('Should return error because nick name already exist', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
              email: 'test@email.com',
              nickname: 'test',
              password: '1234',
            })
            .expect(409);
      });
    });
  });
  describe('v1/users/:id', () => {
    describe('UPDATE', () => {
      it('Should return user with valid entity', () => {
        return request(server)
            .post('/v1/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
              email: 'update@email.com',
              nickname: 'update test',
              password: '1234',
            });
      });
      it('Logging in to get token', () => {
        return request(server)
            .post('/v1/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ 'email': 'update@email.com', 'password': '1234' })
            .then((response) => {
              const { token, id } = response.body;
              validToken = token;
              userId = id;
            });
      });
      it('Should return error when body is null', () => {
        return request(server)
            .put(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validToken}`)
            .expect('Content-Type', /json/)
            .send()
            .expect(422)
            .then((response) => {
              const { message } = response.body;
              expect(message).to.be.equal('Avatar cannot be empty or null');
            });
      });
      it('Should return error when body is empty', () => {
        return request(server)
            .put(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validToken}`)
            .expect('Content-Type', /json/)
            .send({})
            .expect(422)
            .then((response) => {
              const { message } = response.body;
              expect(message).to.be.equal('Avatar cannot be empty or null');
            });
      });
      it('Should return error when avatar is null', () => {
        return request(server)
            .put(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validToken}`)
            .expect('Content-Type', /json/)
            .send({ avatar: null })
            .expect(422)
            .then((response) => {
              const { message } = response.body;
              expect(message).to.be.equal('Avatar cannot be empty or null');
            });
      });
      it('Should return error when avatar is empty', () => {
        return request(server)
            .put(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validToken}`)
            .expect('Content-Type', /json/)
            .send({ avatar: '' })
            .expect(422)
            .then((response) => {
              const { message } = response.body;
              expect(message).to.be.equal('Avatar cannot be empty or null');
            });
      });
      it('Should return error when avatar is not a string', () => {
        return request(server)
            .put(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validToken}`)
            .expect('Content-Type', /json/)
            .send({ avatar: 20 })
            .expect(422)
            .then((response) => {
              const { message } = response.body;
              expect(message).to.be.equal('Avatar must be a String');
            });
      });
      it('Should return success when updated user\'s avatar', () => {
        return request(server)
            .put(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validToken}`)
            .expect('Content-Type', /json/)
            .send({ avatar: 'test' })
            .expect(200)
            .then((response) => {
              const { message } = response.body;
              expect(message).contains(`Updated user id: ${userId}`);
            });
      });
      it('Should return success when deleting user', () => {
        return request(server)
            .delete(`/v1/users/${userId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validToken}`)
            .expect('Content-Type', /json/);
      });
    });
  });
  describe('DELETE', () => {
    it('Should return user with valid entity', () => {
      return request(server)
          .post('/v1/users')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send({
            email: 'delete@delete.com',
            nickname: 'delete',
            password: '1234',
          });
    });
    it('Logging in to get token', () => {
      return request(server)
          .post('/v1/login')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .send({ 'email': 'delete@delete.com', 'password': '1234' })
          .then((response) => {
            const { token, id } = response.body;
            validToken = token;
            userId = id;
          });
    });
    it('You Should return success when deleting user', () => {
      return request(server)
          .delete(`/v1/users/${userId}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${validToken}`)
          .expect('Content-Type', /json/)
          .send({})
          .expect(200)
          .then((response) => {
            const { message } = response.body;
            expect(message).contains(`Deleted user id: ${userId}`);
          });
    });
  });
});
