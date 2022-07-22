const request = require("supertest");
const app = require("../../app");
const { Users, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token;
describe("CREATE TRANSACTION", () => {
	beforeAll(async () => {
    await TransactionHistory.destroy({
      where: {},
      truncate: true,
    });

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

    await TransactionHistory.create({
      productId: 3,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    });
  });

  it("Create Transaction", async () => {    
    
    return request(app)
      .post("/api/transaction")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 2,
        bargainPrice: 1000,
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Create Transaction, but already had it before", async () => {
    return request(app)
      .post("/api/transaction")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 3,
        bargainPrice: 1000,
      })
      .then((res) => {
        expect(res.statusCode).toBe(409);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );
      });
  });

  it("Create Transaction, but in their own", async () => {
    return request(app)
      .post("/api/transaction")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 1,
        bargainPrice: 1000,
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

  it("Create Transaction, but bargain is greater than origial price", async () => {
    return request(app)
      .post("/api/transaction")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 5,
        bargainPrice: 10000000,
      })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );
      });
  });

  it("Create Transaction, but invalid input", async () => {
    return request(app)
      .post("/api/transaction")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: null,
        bargainPrice: undefined,
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
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
