const request = require("supertest");
const app = require("../../app");
const { Users, Products, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, trans_1, trans_2, trans_3;
describe("Notification", () => {
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

    trans_1 = await TransactionHistory.create({
      productId: 1,
      bargainPrice: 1000,
      buyerId: 2,
      dateOfBargain: new Date(),
    }); 

    trans_2 = await TransactionHistory.create({
      productId: 2,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    }); 

    trans_3 = await TransactionHistory.create({
      productId: 1,
      bargainPrice: 1000,
      buyerId: 3,
      dateOfBargain: new Date(),
    }); 
  });

  it("Acc Transaction", async () => {   
    return request(app)
      .put(`/api/transaction/${trans_1.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        accBySeller: true,
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

  it("Reject Transaction ", async () => {   
    return request(app)
      .put(`/api/transaction/${trans_3.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        accBySeller: true,
      })
      .then((res) => {
        console.log(res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Acc Transaction, but not his product", async () => {   
    return request(app)
      .put(`/api/transaction/${trans_2.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        accBySeller: true,
      })
      .then((res) => {
        console.log(res.body);
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Acc Transaction, request is not valid ", async () => {   
    return request(app)
      .put(`/api/transaction/${trans_1.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        accBySeller: "123",
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Sold Product (cancel = false)", async () => {   
    console.log(trans_1);
    return request(app)
      .put(`/api/transaction/${trans_1.id}/confirmation`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        isCanceled: false,
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

  it("Cancel Transaction ", async () => {   
    return request(app)
      .put(`/api/transaction/${trans_3.id}/confirmation`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        isCanceled: true,
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

  it("Cancel Transaction, but not his product ", async () => {   
    return request(app)
      .put(`/api/transaction/${trans_2.id}/confirmation`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        isCanceled: true,
      })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Acc Transaction, request is not valid ", async () => {   
    return request(app)
      .put(`/api/transaction/${trans_1.id}/confirmation`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        isCanceled: "iya di cancel",
      })
      .then((res) => {
        expect(res.statusCode).toBe(422);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });
});
