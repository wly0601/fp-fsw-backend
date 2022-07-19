const request = require('supertest');
const app = require('../../app');
const { Users } = require('../../app/models');
const bcrypt = require("bcryptjs");

let token;

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
      .set(
        'Authorization',
        `Bearer `,
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

  it('Who am I, but I is deleted.', async () => {
    await Users.destroy({
      where: {
        name: 'Hu Tao',
      },
    });
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