const request = require("supertest");
const app = require("../../app");
const { Users, Products } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, user, user_2, token_2, product;
describe("UPDATE PRODUCT", () => {
	beforeAll(async () => {
    const password = "gaktausayang";
    user = await Users.create({
      name: "Hu Tao Lagi",
      email: "hutaocantik@gmail.com",
      encryptedPassword: bcrypt.hashSync(password, 10),
    });

    user_2: await Users.create({
      name: "Yanfei",
      email: "yanfei@gmail.com",
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
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: "yanfei@gmail.com",
        password,
      })
      .then((res) => {
        token_2 = res.body.token;
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
        product = res.body
        console.log(product);
      })
  });

  it("Update Product, not have any problem, response should be 201", async () => {    

    return request(app)
      .put(`/api/product/${product.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: "Rubik 3x3 Merk GAN",
        sellerId: user.id,
        price: 150000,
        categoryId: 17,
        description: "licin bosku",
        images: ["gak ada"],
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

  it("Update Product, but product not found", async () => {
    return request(app)
      .put(`/api/product/${product.id + 1}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: "Rubik 3x3 Merk GAN",
        sellerId: user.id,
        price: 150000,
        categoryId: 17,
        description: "licin bosku",
        images: ["gak ada"],
      })
      .then((res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String)
          })
        );
      });
  });

  it("Update Product, correspond seller is wrong", async () => {
    return request(app)
      .put(`/api/product/${product.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token_2}`)
      .send({ 
        name: "Rubik 3x3 Merk GAN",
        sellerId: user.id,
        price: 150000,
        categoryId: 17,
        description: "licin bosku",
        images: ["gak ada"],
      })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String)
          })
        );
      });
  });

 it("Update Product, but format images is wrong", async () => {
    return request(app)
      .put(`/api/product/${product.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: "Rubik 3x3 Merk GAN",
        sellerId: user.id,
        price: 150000,
        categoryId: 17,
        description: "licin bosku",
        images: "gak ada",
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
