const request = require("supertest");
const app = require("../../app");
const { Users, Products, TransactionHistory } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, user, product;
describe("GET PRODUCT", () => {
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

    await request(app)
      .post("/api/products")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: "Rubik 3x3",
        price: 70000,
        categoryId: 17,
        description: "licin bosku",
        images: ["gak ada"],
      })
      .then((res) => {
        product = res.body;
      });
  });

  it("Get Product, not have any problem, response should be 200", async () => {    
    return request(app)
      .get(`/api/product/${product.id}`)
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

  it("Get Product, but not found", async () => {    
    return request(app)
      .get(`/api/product/${(-1) * product.id}`)
      .set("Content-Type", "application/json")
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Get Product, but req params is wrong", async () => {    
    return request(app)
      .get(`/api/product/1?buyerId=nomor-satu-untukku`)
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

  it("Get Product, with bookmark & disable button", async () => {
    await TransactionHistory.create({
      productId: 1,
      bargainPrice: 1000,
      buyerId: 5,
      dateOfBargain: new Date(),
    });

    return request(app)
      .get(`/api/product/1?buyerId=5`)
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
});
