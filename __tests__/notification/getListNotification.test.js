const request = require("supertest");
const app = require("../../app");
const { Users, Products, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, getThis, getThis_2;
describe("LIST PRODUCT", () => {
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

    getThis_2 = await TransactionHistory.create({
      productId: 3,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    }); 

    getThis = await TransactionHistory.create({
      productId: 4,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    });

  });

  // afterAll(async () => {
  //   await TransactionHistory.destroy({
  //     where: {
  //       id: getThis.id
  //     }
  //   }); 

  //   await TransactionHistory.destroy({
  //     where: {
  //       id: getThis_2.id
  //     }
  //   }); 
  // });

  it("Get Notification", async () => {    
    return request(app)
      .get(`/api/notifications`)
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

  it("Get Notification, but transaction exist", async () => {
    await TransactionHistory.create({
      productId: 1,
      bargainPrice: 1000,
      buyerId: 5,
      dateOfBargain: new Date(),
    }); 

    const update_1 = await TransactionHistory.update({
      accBySeller: true,
      dateOfAccOrNot: new Date(),
    }, {
      where: {
        id: getThis_2.id
      }
    }); 

    const update_2 = await TransactionHistory.update({
      accBySeller: false,
      dateOfAccOrNot: new Date(),
    }, {
      where: {
        id: getThis.id
      }
    }); 

    return request(app)
      .get(`/api/notifications`)
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
});
