const request = require("supertest");
const app = require("../../app");
const { Users, Products } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token, user, product;
describe("LIST PRODUCT", () => {
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

  });

  it("List Product, (with pagination)", async () => {    
    return request(app)
      .get(`/api/products?page=2&pageSize=5`)
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

  it("List Product, (with search query)", async () => {    
    return request(app)
      .get(`/api/products?search=jam%20tangan`)
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

  it("List Product, (with category query)", async () => {    
    return request(app)
      .get(`/api/products?category=fotografi`)
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

  it("List Product that created/sell by specific user", async () => {    
    return request(app)
      .get(`/api/user/1/products?filterByStatusId=1`)
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

  it("List Product that created/sell by specific user, but bad request", async () => {    
    return request(app)
      .get(`/api/user/1/products?filterByStatusId=satuduatiga`)
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

  it("List Product with bookmark show", async () => {    
    return request(app)
      .get(`/api/products?buyerId=1`)
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

  it("List Product with bookmark show, but bad request", async () => {    
    return request(app)
      .get(`/api/products?page=dua`)
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String),
          })
        );
      });
  });
});
