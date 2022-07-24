const request = require("supertest");
const app = require("../../app");
const { Users } = require('../../app/models');
const bcrypt = require("bcryptjs");

var token;
describe("CREATE PRODUCT", () => {
	beforeAll(async () => {
    const password = "gaktausayang";
    await Users.create({
      name: "Hu Tao",
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

  it("Create Product, not have any problem, response should be 201", async () => {    
    
    return request(app)
      .post("/api/products")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: "Kacamata Pantai",
        price: 150000,
        categoryId: 12,
        description: "Enak buat di pantai",
        images: ["https://source.unsplash.com/500x500",
        "https://source.unsplash.com/500x500"]
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

  it("Create Product, but bad request", async () => {
    return request(app)
      .post("/api/products")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: "Kacamata Pantai",
        price: 150000,
        categoryId: 12,
        description: "Enak buat di pantai",
        images: "https://source.unsplash.com/500x500"
      })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
        expect.objectContaining({
          error: {
            name: expect.any(String),
            message: expect.any(String)
          }
          })
        );
      });
  });

  it("Create Product, but price is not number", async () => {
    return request(app)
      .post("/api/products")
      .set("Content-Type", "application/json")
      .set('Authorization', `Bearer ${token}`)
      .send({ 
        name: "Kacamata Pantai",
        price: "150000",
        categoryId: 12,
        description: "Enak buat di pantai",
        images: ["https://source.unsplash.com/500x500"]
      })
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
