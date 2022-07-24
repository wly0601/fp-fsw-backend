const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('Should response 200 as status', async () => {
    //Get proper root endpoint
    await request(app)
      .get('/')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'OK',
          message: 'Second Hand API is up and running!',
        });
      });
  });

  it('Should response 404 as status', async () => {
    //Improper root endpoint (example : '/ara-ara')
    await request(app)
    .get('/ara-ara')
		.then((res) => {
      expect(res.status).toBe(404);
    });
  });
});