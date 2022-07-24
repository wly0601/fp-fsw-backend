const request = require('supertest');
const app = require('../../app');
const { Users } = require("../../app/models");
const bcrypt = require("bcryptjs");

describe('POST /api/login', () => {
  const password = "gaktausayang";
  const createUser = {
    name: "Raiden",
    email: "raiden@gmail.com",
    encryptedPassword: bcrypt.hashSync(password, 10),
  };

  beforeAll(async () => {
    await Users.create(createUser);
  });

  it('Not have any problem, response should be 201 with the token', async () => {
		return request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: createUser.email,
        password,
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            email: expect.any(String),
            token: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });
  });

  it("Login new user, but email is empty", async () => {    
    return request(app)
      .post("/api/login")
      .set("Content-Type", "application/json")
      .send({ 
        email: "", 
        password 
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

  it("Login new user, but format is wrong", async () => {    
    return request(app)
      .post("/api/login")
      .set("Content-Type", "application/json")
      .send({ 
        email: undefined, 
        password 
      })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(
          expect.objectContaining({
            status: expect.any(String),
            message: expect.any(String)
          })
        );
      });
  });

  it('Email is not registered, response should be 404', async () => {
    // Testing the email is not registered, 
    // Choose (for example) "typo version of createUser.email"
    const emailPick = createUser.email.split("@")[0];
    const notRegisteredEmail = emailPick.substring(0, emailPick.length - 2) + "@gmail.com";

    return request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: notRegisteredEmail,
        password,
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

  it('Email is fine, but the password is incorrect, response should be 401', async () => {
    // Testing the password is incorrect, 
    // Choose (for example) "typo version of password"
    const wrongPassword = password.substring(0, password.length - 2);
		console.log(createUser.email);
    return request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({
        email: createUser.email,
        password: wrongPassword
      })
      .then((res) => {
        expect(res.statusCode).toBe(401);
        expect.objectContaining({
					status: expect.any(String),
					message: expect.any(String),
        });
      });
  });
});