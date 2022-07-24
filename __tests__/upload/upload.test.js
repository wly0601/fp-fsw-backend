const request = require('supertest');
const fs = require('mz/fs');
const app = require("../../app");
const bcrypt = require("bcryptjs");
const TIMEOUT_INTERVAL = 40000;

let testFilePath = null;
let token;
describe('Upload file', () => {
  beforeAll(async () => {
    await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: "ahmadalfajr@gmail.com",
        password: "12345678",
      })
      .then((res) => {
        token = res.body.token;
      });
  });
  const filePath = `${__dirname}/docs/test.jpg`;

  it('should upload the test file to CDN', () => {
    fs.exists(filePath)
      .then((exists) => {
        return request(app)
          .put('/api/user/picture/1/cloudinary')
          .set('Authorization', `Bearer ${token}`)
          .attach('file', filePath)
          .then((res) => {
            expect(res.statusCode).toBe(201);
            expect(res.message).toBe('Upload image berhasil');
          })
          .catch(err => console.log(err));
      });
  }, TIMEOUT_INTERVAL);

  it('Upload to CDN, but unauthorized.', () => {
    fs.exists(filePath)
      .then((exists) => {
        return request(app)
          .put('/api/user/picture/2/cloudinary')
          .set('Authorization', `Bearer ${token}`)
          .attach('file', filePath)
          .then((res) => {
            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual(
              expect.objectContaining({
                status: "Unauthorized",
                message: "User who can upload profile picture is him/herself."
              })
            );
          });
      });
  }, TIMEOUT_INTERVAL);

  it('Upload to CDN, but no file.', () => {
    const noFile = `${__dirname}/docs/tests.jpg`;
    fs.exists(noFile)
      .then((exists) => {
        return request(app)
          .put('/api/user/picture/2/cloudinary')
          .set('Authorization', `Bearer ${token}`)
          .attach('file', noFile)
          .then((res) => {
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual(
              expect.objectContaining({
                error: expect.any(String),
                message: "Gagal upload file!",
              })
            );
          });
      });
  }, TIMEOUT_INTERVAL);
});