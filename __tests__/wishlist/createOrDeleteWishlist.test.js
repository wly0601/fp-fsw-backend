const request = require("supertest");
const app = require("../../app");
const { Users, Products, userProduct } = require('../../app/models');
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

var token, user, product;
describe("CREATE / DELETE WISHLIST", () => {
  beforeAll(async () => {
    await userProduct.destroy({
      where: {
        productId: {
          [Op.or]: [1,2],
        },
        buyerId: 1,
      }
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
  });

  afterAll(async () => {
    await userProduct.destroy({
      where: {
        productId: {
          [Op.or]: [1,2],
        },
        buyerId: 1,
      }
    });
  });

  it("Should create Wishlist, but wishing the own product", () => {    
    return request(app)
      .post("/api/wishlist")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 1,
        activeBtn: false
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

  it("Should create Wishlist, not have any problem", () => {    
    return request(app)
      .post("/api/wishlist")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 2,
        activeBtn: false
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );
      });
  });

  it("Should create Wishlist, but already marked", () => {    
    return request(app)
      .post("/api/wishlist")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 2,
        activeBtn: false
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

  it("Should delete wishlist", () => {     
    return request(app)
      .post("/api/wishlist")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 2,
        activeBtn: true
      })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );
      });
  });

  it("Should delete wishlist that not even existed", () => {     
    return request(app)
      .post("/api/wishlist")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: 2,
        activeBtn: true
      })
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

  it("Should response 400", () => {     
    return request(app)
      .post("/api/wishlist")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        productId: "tiga",
        activeBtn: false
      })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: {
              status: expect.any(String),
              message: expect.any(String),
            }
          })
        );
      });
  });
});
