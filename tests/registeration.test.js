import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import connetDB, { clearAllCollections } from "../src/db/connection.js";
import env from "dotenv";

env.config();
await clearAllCollections(mongoose.connection);

describe("POST /users/register", () => {
  const url = `${process.env.BASE_URL}/auth/register`;

  describe("Given a username, email, and password", () => {
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
        const testCases = [
          { username: "test", email: "test@mail.com", password: null },
          { username: "test", email: null, password: "Password123" },
          { username: "test", email: null, password: null },
          { username: null, email: "test@mail.com", password: "Password123" },
          { username: null, email: "test@mail.com", password: null },
          { username: null, email: null, password: "Password123" },
          { username: null, email: null, password: null },
        ];

        for (const testCase of testCases) {
          const response = await request(app).post(url).send(testCase);
          expect(response.statusCode).toBe(400);
        }
      });
    });

    describe("Data format is wrong", () => {
      it("Password too short -> 400", async () => {
        const response = await request(app).post(url).send({
          username: "test",
          email: "test@mail.com",
          password: "Test1",
        });
        expect(response.statusCode).toBe(400);
      });

      it("Username too short -> 400", async () => {
        const response = await request(app).post(url).send({
          username: "t",
          email: "test@mail.com",
          password: "Password123",
        });
        expect(response.statusCode).toBe(400);
      });

      it("Password is non-compliant -> 400", async () => {
        const response = await request(app).post(url).send({
          username: "test",
          email: "test@mail.com",
          password: "Password123",
        });
        expect(response.statusCode).toBe(400);
      });
    });

    it("Email is non-compliant -> 400", async () => {
      const response = await request(app).post(url).send({
        username: "test",
        email: "testmail.com",
        password: "Password123",
      });
      expect(response.statusCode).toBe(400);
    });

    describe("Duplicate field", () => {
      it("Email is already taken -> 409", async () => {
        const existingEmail = "chat@sphere.com";
        const response1 = await request(app).post(url).send({
          username: "test",
          email: existingEmail,
          password: "Password123",
        });

        if (response1.statusCode === 201) {
          const response2 = await request(app).post(url).send({
            username: "test",
            email: existingEmail,
            password: "Password123",
          });
          expect(response2.statusCode).toBe(409);
        }
        expect(response1.statusCode).not.toBe(201);
      });
    });
  });
});
