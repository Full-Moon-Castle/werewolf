const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const server = require('../../src/server');

describe('login', () => {
  after(() => {
    server.close();
  });

  it('Should return error because email and password is empty', () => {
    return request(server)
        .post('/v1/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 'email': '', 'password': '' })
        .expect(422)
        .then((response) => {
          expect(response.body).contains('Email is required');
        });
  });

  it('Should return error because email is empty', () => {
    return request(server)
        .post('/v1/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 'email': '', 'password': '123' })
        .expect(422)
        .then((response) => {
          expect(response.body).contains('Email is required');
        });
  });

  it('Should return error because password is empty', () => {
    return request(server)
        .post('/v1/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 'email': 'teste@test.com.br', 'passwaord': '' })
        .expect(422)
        .then((response) => {
          expect(response.body).contains('Password is required');
        });
  });

  it('Should return error because email or password is wrong', () => {
    return request(server)
        .post('/v1/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 'email': 'teste@test.com.br', 'password': '123' })
        .expect(401)
        .then((response) => {
          expect(response.body).contains('Incorrect email or password');
        });
  });

  it('Should return user with valid entity and token', () => {
    return request(server)
        .post('/v1/login')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .send({ 'email': 'test@email.com', 'password': '1234' })
        .expect(200)
        .then((response) => {
          expect(response.body.token).to.not.equal(null);
          expect(response.body.email).equal('test@email.com');
        });
  });
});

