const request = require("supertest");
const app = require("../../app");
const { Users, Products, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, trans_1, trans_2, trans_3;
describe("Notification", () => {
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

    trans_1 = await TransactionHistory.create({
      productId: 3,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    }); 

    trans_2 = await TransactionHistory.create({
      productId: 3,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    }); 

    trans_3 = await TransactionHistory.create({
      productId: 4,
      bargainPrice: 1000,
      buyerId: 1,
      dateOfBargain: new Date(),
    }); 

  });

  afterAll(async () => {
    await TransactionHistory.destroy({
      where: {},
      truncate: true,
    }); 

  });

  it("Get History As Buyer", async () => {  
    const update_1 = await TransactionHistory.update({
      accBySeller: true,
      dateOfAccOrNot: new Date(),
    }, {
      where: {
        id: trans_1.id
      }
    });  

    const update_2 = await TransactionHistory.update({
      accBySeller: false,
      dateOfAccOrNot: new Date(),
    }, {
      where: {
        id: trans_2.id
      }
    });  

    const update_3 = await TransactionHistory.update({
      isCanceled: true,
    }, {
      where: {
        id: trans_3.id
      }
    });  
    return request(app)
      .get(`/api/user/buyer/history-as-buyer`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        console.log(res.body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

});
