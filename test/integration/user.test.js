const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const server = require('../../src/server');

describe('users', () => {
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
              email: 'testi@email.com',
              nickname: 'test',
              password: '1234',
            })
            .expect(409);
      });
      it('Will return error because id was not informed', () => {
        return request(server)
            .delete('/v1/users/')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .send({})
            .expect(404);
      });
      describe('DELETE', () => {
        it('Must return error because id is not a number', () => {
          return request(server)
              .delete('/v1/users/error')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({})
              .expect(409)
              .then((response) => {
                expect(response.body).contains('The id is not an number');
              });
        });
        it('You must return success when deleting user', () => {
          return request(server)
              .delete('/v1/users/4')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({})
              .expect(200)
              .then((response) => {
                expect(response.body.message).contains('Deleted user id: 4');
              });
        });
      });
    });
  });
});
