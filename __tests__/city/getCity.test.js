const request = require('supertest');
const app = require('../../app');
const { Users, Cities } = require('../../app/models');
const bcrypt = require("bcryptjs");

let token;

describe('GET CITY (All & By ID)', () => {
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

  it('Get All city, should response with status code 200', async () => {
    return request(app)
      .get(`/api/cities`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Get city, should response with status code 200', async () => {
    const cityCount = await Cities.count();
    return request(app)
      .get(`/api/city/${cityCount}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Get All city, Should response with status code 404', async () => {
    const cityCount = await Cities.count();
    return request(app)
      .get(`/api/city/${cityCount + 1}`)
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );   
      });
  });

  it('Get All City', async () => {

    return request(app)
      .get('/api/cities')
      .set('Accept', 'application/json')
      .set('Authorization',`Bearer ${token}`)
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