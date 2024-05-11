import request from "supertest";
import app from "../index.js";

import env from "dotenv";
env.config();

describe("POST /users/login", () => {
  const registerURL = `${process.env.BASE_URL}/auth/register`;
  const url = `${process.env.BASE_URL}/auth/login`;
  const verifyURL = `${process.env.BASE_URL}/auth/verify/test@mail.com`;
  describe("given email and password", () => {
    // all is well
    it("should return 200 OK", async () => {
      const registerResponse = await request(app).post(registerURL).send({
        username: "test",
        email: "test@mail.com",
        password: "Password@123",
      });

      await request(app).get(`${verifyURL}`).send();

      const res = await request(app).post(url).send({
        email: "test@mail.com",
        password: "Password@123",
      });
      expect(res.status).toEqual(200);
    });

    describe("Missing data -> 400", () => {
      it("should respond with status code 400", async () => {
        const possibleResponses = [
          { email: "test@mail.com", password: null },
          { email: null, password: "Password123" },
          { email: null, password: null },
        ];

        for (const testCase of possibleResponses) {
          const response = await request(app).post(url).send(testCase);
          expect(response.statusCode).toBe(400);
        }
      });
    });

    describe("Data is wrong -> 401", () => {
      it("Wrong mail", async () => {
        const registerResponse = await request(app).post(registerURL).send({
          username: "test",
          email: "test@mail.com",
          password: "Password@123",
        });

        await request(app).get(`${verifyURL}`).send();
        const loginResponse = await request(app).post(url).send({
          email: "wrong@mail.com",
          password: "Password@123",
        });
        expect(loginResponse.statusCode).toBe(401);
      });

      it("Wrong password", async () => {
        const registerResponse = await request(app).post(url).send({
          username: "test",
          email: "test@mail.com",
          password: "Password@123",
        });

        await request(app).get(`${verifyURL}`).send();
        const loginResponse = await request(app).post(url).send({
          email: "test@mail.com",
          password: "WrongPassword123",
        });
        expect(loginResponse.statusCode).toBe(401);
      });
    });
  });
});
