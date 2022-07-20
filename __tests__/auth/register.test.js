const request = require("supertest");
const app = require("../../app");
const { Users } = require('../../app/models');
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

describe("POST /api/register", () => {
  const names = ["Elaina","Aurellia","Anya","Gabriella"];

  const password = "gaktausayang";
  const createUser = {
    name: "Hu Tao",
    email: "hutaocantik@gmail.com",
    encryptedPassword: bcrypt.hashSync(password, 10)
  };

  it("Register new user, not have any problem, response should be 201", async () => {
    //Generate random name from names[], then set it's email and password.
    const name = names[Math.floor(Math.random()*names.length)];
    const email = `${name}@gmail.com`;
    const password = "password";
    
    return request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({ 
        name, 
        email, 
        password 
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

  it("Register new user, but format is wrong", async () => {    
    return request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({ 
        name: "Aku siapa",
        email: "siapahayo@gmail.com", 
        password: ['i','l','o','v','e','y','o','u'],
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


  it("Register new user, but name is empty", async () => {
    //Generate random name from names[], then set it's email and password.
    const name = names[Math.floor(Math.random()*names.length)];
    const email = `${name}@binar.co.id`;
    const password = "password";
    
    return request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({ 
        name: "", 
        email, 
        password 
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

  it("Register new user, but email already taken, response should be 409", async () => {
    
    //Find random data user from database, then pick the email
    //This is only to make sure that we get the email that already in database
    const userCount = await Users.count();
    const randomId = Math.floor(Math.random()*userCount) + 1;
    var pickUser = await Users.findOne({
      where : {
        id: randomId,
      }
    });

    //But if the database is empty, then we must create one first
    if(!pickUser){
      pickUser = await Users.create(createUser);
    }

    //Find random name from names[], but set the email same as pickUser.email
    const name = names[Math.floor(Math.random()*names.length)];

    return request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({ 
        name,
        email: pickUser.email,
        password,
      })
      .then((res) => {
        expect(res.statusCode).toBe(409);
        expect(res.body).toEqual(
          expect.objectContaining({
            ...res.body,
          })
        );        
      });
  });

	it("Register new user, but email format is wrong", async () => {
    
    //Find random name from names[], but the format email is wrong
    const name = names[Math.floor(Math.random()*names.length)];
		const email = `iniemailnya${name}`;
		const password = "12345678";

    return request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({ 
        name,
        email,
        password,
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
	it("Register new user, but password is less than 8 characters.", async () => {

    const name = names[Math.floor(Math.random()*names.length)];
		const email = `${name}@gmail.com`;
		const password = "ababab";

    return request(app)
      .post("/api/register")
      .set("Content-Type", "application/json")
      .send({ 
        name,
        email,
        password,
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
