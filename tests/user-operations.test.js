import User from "./user.js";
import request from "supertest";
import app from "../starter.js";
import mongoose from "mongoose";
import connetDB, { clearAllCollections } from "../src/db/connection.js";
import env from "dotenv";

env.config();
await clearAllCollections(mongoose.connection);

const alice = new User("alice", "alice@mail.com", "Password@123");
const bob = new User("bob", "bob@mail.com", "Password@123");

const profile = alice.email;
const profileURL = `${process.env.BASE_URL}/profile/${profile}`;
const changeUsernameURL = `${process.env.BASE_URL}/profile/change-username/${profile}`;
const publicProfileURL = `${process.env.BASE_URL}/profile/username/${bob.email}`;

await alice.register();
await bob.register();

const aliceToken = await alice.getToken();
const bobToken = await bob.getToken();

describe("User operations", () => {
  describe("Get user by email", () => {
    it("View your profile with your email -> 200", async () => {
      const response = await request(app)
        .get(profileURL)
        .set("Authorization", aliceToken);
      expect(response.statusCode).toBe(200);
    });

    it("View non-existent user -> 404", async () => {
      const wrongMail = "luke@mail.com";
      const wrongURL = `${process.env.BASE_URL}/profile/${wrongMail}`;
      const response = await request(app)
        .get(wrongURL)
        .set("Authorization", aliceToken);
      expect(response.statusCode).not.toBe(200);
    });

    it("View existent user but writing in wrong format -> 400", async () => {
      const wrongMail = "bobmail.com";
      const wrongURL = `${process.env.BASE_URL}/profile/${wrongMail}`;
      const response = await request(app)
        .get(wrongURL)
        .set("Authorization", aliceToken);
      expect(response.statusCode).toBe(400);
    });

    it("Change your username with your token -> 200", async () => {
      const response = await request(app)
        .patch(changeUsernameURL)
        .set("Authorization", aliceToken)
        .send({ username: "Cooler Alice" });
      expect(response.statusCode).toBe(200);
    });

    it("Change other user's username with your token -> 403", async () => {
      const invalidChange = `${process.env.BASE_URL}/profile/change-username/${bob.email}`;
      const response = await request(app)
        .patch(invalidChange)
        .set("Authorization", aliceToken)
        .send({ username: "Cooler Bob" });
      expect(response.statusCode).toBe(403);
    });

    it("View other user's profile with your token -> 200", async () => {
      const response = await request(app)
        .get(publicProfileURL)
        .set("Authorization", bobToken);
      expect(response.statusCode).toBe(200);
    });
  });
});
