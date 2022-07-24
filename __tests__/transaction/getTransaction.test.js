const request = require("supertest");
const app = require("../../app");
const { Users, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, trans;
describe("GET TRANSACTION BY ID", () => {
  beforeAll(async () => {
    await TransactionHistory.destroy({
      where: {},
      truncate: true
    });

    const password = "gaktausayang";
    user = await Users.create({
      name: "Hu Tao Lagi",
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

  afterAll(async () => {
    await TransactionHistory.destroy({
      where: {},
      truncate: true
    });
  });

  it("Get Transaction, not have any problem, response should be 200", async () => {   
    trans = await TransactionHistory.create({
      productId: 3,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    });
    
    return request(app)
      .get(`/api/transaction/${trans.id}`)
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

  it("Get Transaction, but req params is wrong", async () => {   
    return request(app)
      .get(`/api/transaction/2+2`)
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

  it("Get Transaction, but it not exist", async () => {   
    const count = await TransactionHistory.count();
    return request(app)
      .get(`/api/transaction/${count+10}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );
      });
  });

});