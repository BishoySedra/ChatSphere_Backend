import request from "supertest";
import app  from "../index.js";

import env from "dotenv"
 env.config()

describe("POST /users/register", () => {
  describe("given a username, email and password", () => {
    const url = `${process.env.BASE_URL}/auth/register`;
    // all is well
    it("should respond with status code 201", async () => {
      const response = await request(app).post(url).send({
        username: "test",
        email: "test@mail.com",
        password: "Password@123",
      });
      expect(response.statusCode).toBe(201);
    });

    describe("Missing data", () => {
      it("should respond with status code 400", async () => {
        const possibleResponses = [
          { username: "test", email: "test@mail.com", password: null },
          { username: "test", email: null, password: "Password123" },
          { username: "test", email: null, password: null },
          { username: null, email: "test@mail.com", password: "Password123" },
          { username: null, email: "test@mail.com", password: null },
          { username: null, email: null, password: "Password123" },
          { username: null, email: null, password: null },
        ];

        for (const testCase of possibleResponses) {
          const response = await request(app)
            .post(url)
            .send(testCase);
          expect(response.statusCode).toBe(400);
        }
      });
    });
    describe("Data format is wrong", () => {
      // password is too short
      it("Password too short -> 400", async () => {
        const response = await request(app).post(url).send({
          username: "test",
          email: "test@mail.com",
          password: "Test1",
        });
        //expect(password.length).toBeLessThan(8);
        expect(response.statusCode).toBe(400);
      });

      it("Username too short -> 400", async () => {
        const response = await request(app).post(url).send({
          username: "t",
          email: "test@mail.com",
          password: "Password123",
        });
        //expect(username.length).toBeLessThan(3);
        expect(response.statusCode).toBe(400);
      });

      // password is not valid
      it("Password is non-compliant -> 400", async () => {
        const response = await request(app).post(url).send({
          username: "test",
          email: "test@mail.com",
          password: "Password123",
        });
        // expect(password).not.toMatch(
        //   /^ (?=.* [A - Z])(?=.* [a - z])(?=.*\d).+ $/,
        // );
        expect(response.statusCode).toBe(400);
      });
    });

    // email is not valid
    it("Email is non-compliant -> 400", async () => {
      const response = await request(app).post(url).send({
        username: "test",
        email: "testmail.com",
        password: "Password123",
      });
      //expect(email).not.toMatch(/^\S+@\S+\.\S+$/);
      expect(response.statusCode).toBe(400);
    });

    describe("Duplicate field", () => {
      
      it("email is already taken -> 409", async () => {
        const existingEmail = "chat@sphere.com";
        const response1 = await request(app).post(url).send({
            username: "test",
            email: existingEmail,
            password: "Password123",
          });
        if(response1.statusCode === 201){
            const response2 = await request(app).post(url).send({
                username: "test",
                email: existingEmail,
                password: "Password123",
              });
              expect(response2.statusCode).toBe(409);
        }
        expect(response1.statusCode).not.toBe(201)
      });
    });
  });
});
