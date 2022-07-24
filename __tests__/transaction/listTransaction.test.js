const request = require("supertest");
const app = require("../../app");
const { Users, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, trans;
describe("GET TRANSACTION BY ID", () => {
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

  it("List transaction buyer on seller", async () => {   
    return request(app)
      .get(`/api/buyer/1/transaction`)
      .set("Content-Type", "application/json")
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
  
  it("List transaction buyer on seller (params is wrong)", async () => {   
    return request(app)
      .get(`/api/buyer/yuneda/transaction`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: {
              name: expect.any(String),
              message: expect.any(String),
            }
          })
        );
      });
  });
});