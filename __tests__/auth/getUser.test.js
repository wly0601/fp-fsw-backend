const request = require('supertest');
const app = require('../../app');
const { Users } = require('../../app/models');
const bcrypt = require("bcryptjs");

let token;

describe('GET USER', () => {
  beforeAll(async () => {
    const password = "gaktausayang";
    await Users.create({
      name: "Yae Miko",
      email: "yaemiko@gmail.com",
      encryptedPassword: bcrypt.hashSync(password, 10),
    });

    await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: "yaemiko@gmail.com",
        password,
      })
      .then((res) => {
        token = res.body.token;
      });
  });

  it('Should response with status code 200', async () => {
    const getUser = await Users.findOne({
      where: {
        email: "yaemiko@gmail.com"
      }
    })

    return request(app)
      .get(`/api/user/${getUser.id}`)
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Get user, but the user not found', () => {
    return request(app)
      .get(`/api/user/-1`)
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Get all user', async () => {

    return request(app)
      .get('/api/users')
      .set('Accept', 'application/json')
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
});