const request = require("supertest");
const app = require("../../app");
const { Users, Products, userProduct } = require('../../app/models');
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

var token, user, product;
describe("LIST ALL WISHLIST", () => {
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

    await request(app)
      .post('/api/wishlist')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId: 3,
        activeBtn: false
      })
  });

  afterAll(async () => {
    await userProduct.destroy({
      where: {
        productId: 3,
        buyerId: 1,
      }
    })
  });

  it("Should get Wishlists, not have any problem", () => {    
    return request(app)
      .get("/api/wishlist")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      })
  });
});
