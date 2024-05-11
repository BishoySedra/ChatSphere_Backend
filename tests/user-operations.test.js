import User from "./user.js";
import request from "supertest";
import app from "../index.js";

import env from "dotenv";
env.config();

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

// Cases =>
// 1. Alice tries to view Alice's profile with Alice's token -> 200
// 2. Alice tries to view Luke's profile with Alice's token -> 404
// 3. Alice tries to view Bob's profile with Alice's token, Bob's mail address is written in wrong format -> 400
// 4. Alice tries to change Alice's username with Alice's token -> 200
// 5. Alice tries to change Bob's username with Alice's token -> 403
// 6. Alice tries to view Bob's profile with Alice's token -> 200
// 7. Alice tries to change Bob's username with Bob's token -> 403, problem with telling who am I

describe("User operations", () => {
  describe("Get user by email", () => {
    it("View your profile with your email -> 200", async () => {
      const response = await request(app)
        .get(profileURL)
        .set("Authorization", aliceToken);
      expect(response.statusCode).toBe(200);
    });

    it("View non-existent user -> 404 (not 200)", async () => {
      const wrongMail = "luke@mail.com";
      const wrongURL = `${process.env.BASE_URL}/profile/${wrongMail}`;
      const response = await request(app)
        .get(wrongURL)
        .set("Authorization", aliceToken);
      expect(response.statusCode).not.toBe(200);
    });

    it("View existent user but writing in wrong format -> 400 ", async () => {
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
