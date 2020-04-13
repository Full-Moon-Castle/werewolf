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
    });
  });
});
