const request = require("supertest");
const app = require("../../app");
const { Users, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, user;
describe("GET TRANSACTION BY ID", () => {
  beforeAll(async () => {
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

      await TransactionHistory.create({
        productId: 3,
        bargainPrice: 1000,
        buyerId: 1,
        dateOfBargain: new Date(),
      });
  });

  it("Get Transaction, not have any problem, response should be 200", async () => {   
    const transactionCount = await TransactionHistory.count(); 
    return request(app)
      .get(`/api/transaction/${transactionCount}`)
      .set("Content-Type", "application/json")
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
    const transactionCount = await TransactionHistory.count(); 
    return request(app)
      .get(`/api/transaction/2+2`)
      .set("Content-Type", "application/json")
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