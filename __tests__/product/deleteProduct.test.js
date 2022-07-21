const request = require("supertest");
const app = require("../../app");
const { Users, Products } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, user, product;
describe("DELETE PRODUCT", () => {
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
      })
  });

  it("Delete Product", async () => {    
    return request(app)
      .delete(`/api/product/${product.id}`)
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

  it("Delete Product", async () => {    
    return request(app)
      .delete(`/api/product/2`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => { 
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Delete Product", async () => {    
    return request(app)
      .delete(`/api/product/${(-1)*product.id}`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => { 
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });

  it("Delete Product", async () => {    
    return request(app)
      .delete(`/api/product/paansih`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => { 
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );
      });
  });
});
