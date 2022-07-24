const request = require('supertest');
const app = require('../../app');
const { Users } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token;

describe('Who Am I', () => {
  beforeAll(async () => {
    const password = "gaktausayang";
    await Users.create({
      name: "Hu Tao",
      email: "hutaocantik@gmail.com",
      encryptedPassword: bcrypt.hashSync(password, 10),
    });

    await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: "hutaocantik@gmail.com",
        password,
      })
      .then((res) => {
        token = res.body.token;
      });
  });

  it('Should response with status code 200', () => {
    return request(app)
      .get('/api/who-am-i')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Not have token, response should be 401', () => {
    return request(app)
      .get('/api/who-am-i')
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Token is expired', async () => {

    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsIm5hbWUiOiJIdSBUYW8iLCJlbWFpbCI6Imh1dGFvY2FudGlrQGdtYWlsLmNvbSIsImlhdCI6MTY1ODIzMDYzNSwiZXhwIjoxNjU4MjM0MjM1fQ.a1VwjQtJkcDNC21DHZ3yodXj1y0l7FbOtbkEOM1yerw";

    return request(app)
      .get('/api/who-am-i')
      .set('Accept', 'application/json')
      .set(
        'Authorization',
        `Bearer ${token}`,
      )
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });    
});