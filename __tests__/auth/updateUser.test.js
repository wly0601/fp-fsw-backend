const request = require('supertest');
const app = require('../../app');
const { Users } = require('../../app/models');
const bcrypt = require("bcryptjs");

let token;

describe('UPDATE USER', () => {
  beforeAll(async () => {
    const password = "gaktausayang";
    await Users.create({
      name: "Keqing",
      email: "keqingcantik@gmail.com",
      encryptedPassword: bcrypt.hashSync(password, 10),
    });

    await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: "keqingcantik@gmail.com",
        password,
      })
      .then((res) => {
        token = res.body.token;
      });
  });

  var getUser;
  it('Should response with status code 200', async () => {
    getUser = await Users.findOne({
      where: {
        email: "keqingcantik@gmail.com"
      }
    });
    return request(app)
      .put(`/api/users/${getUser.id}/detail`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: getUser.name,
        photo: 'https://source.unsplash.com/500x500',
        phoneNumber: '086969696969',
        address: 'Liyue',
        cityId: 2,
      })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );   
      });
  });

  it('Updating user that different from id login', () => {
    return request(app)
      .put(`/api/users/${getUser.id + 1}/detail`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: getUser.name,
        photo: 'https://source.unsplash.com/500x500',
        phoneNumber: '086969696969',
        address: 'Liyue',
        cityId: 2,
      })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );   
      });
  });

  it('Updating user but city Id is not positive number', () => {
    return request(app)
      .put(`/api/users/${getUser.id}/detail`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: getUser.name,
        photo: 'https://source.unsplash.com/500x500',
        phoneNumber: '086969696969',
        address: 'Liyue',
        cityId: 0,
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );   
      });
  });
});