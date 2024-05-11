import request from "supertest";
import app from "../index.js";
import User from "./user.js";
import mongoose from "mongoose";
import connetDB, { clearAllCollections } from "../src/db/connection.js";

import env from "dotenv";
env.config();

await clearAllCollections(mongoose.connection);

const anakin = new User("Alice", "anakin@mail.com", "Password@123");
const padme = new User("Padme", "padme@mail.com", "Password@123");

await anakin.register();
await padme.register();

const anakinToken = await anakin.getToken();
const padmeToken = await padme.getToken();

const privateChatsURL = `${process.env.BASE_URL}/chats/private/${anakin.email}`;
const groupChatsURL = `${process.env.BASE_URL}/chats/groups/${anakin.email}`;

// Cases =>
// 1. Anakin tries to access Anakin's private chats using Anakin's token -> 200
// 2. Anakin tries to access Padme's private chats using Anakin's token -> 403?
// 3. Anakin tries to access Luke's private chats using Anakin's token, Luke is non existent -> 404 , return 403 instead, TODO: kill mohand and beshoy and return 404
// 4. Anakin tries to access Anakin's private chats using Anakin's token, email is spelled wrong -> 400
// 5. Anakin tries to access Anakin's group chats using Anakin's token -> 200
// 6. Anakin tries to access Padme's group chats using Anakin's token -> 403
// 7. Anakin tries to access Luke's group chats using Anakin's token, Luke is non existent -> 404
// 8. Anakin tries to access Anakin's group chats using Anakin's token, email is spelled wrong -> 400

describe("Chats tests", () => {
  describe("Private chats", () => {
    // all is well
    it("Access your own private chats with your token -> 200", async () => {
      const senderMail = "anakin@mail.com";
      const receiverMail = "padme@mail.com";
      const sendApiURL = `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`;
      const receiveApiURL = `${process.env.BASE_URL}/users/${receiverMail}/response/${senderMail}`;

      await request(app).post(sendApiURL).set("Authorization", anakinToken);

      await request(app)
        .post(receiveApiURL)
        .set("Authorization", padmeToken)
        .send({ status: "ACCEPTED" });

      const response = await request(app)
        .get(privateChatsURL)
        .set("Authorization", anakinToken);

      console.log("ANAKIN's ", response.body);

      expect(response.status).toBe(200);
    });

    it("Access another user's private chats with your token -> 403", async () => {
      const response = await request(app)
        .get(privateChatsURL)
        .set("Authorization", padmeToken);
      expect(response.status).toBe(403);
    });

    it("Access your own private chats with your token, email is spelled wrong -> 400", async () => {
      const wrongURL = `${process.env.BASE_URL}/chats/private/anakinmail.com`;
      const response = await request(app)
        .get(wrongURL)
        .set("Authorization", anakinToken);
      expect(response.status).toBe(400);
    });
  });

  describe("Group chats", () => {
    it("Access your own group chats with your token -> 200", async () => {
      const response = await request(app)
        .get(groupChatsURL)
        .set("Authorization", anakinToken);
      expect(response.status).toBe(200);
    });

    it("Access another user's group chats with your token -> 403", async () => {
      const response = await request(app)
        .get(groupChatsURL)
        .set("Authorization", padmeToken);
      expect(response.status).toBe(403);
    });

    it("Access your own group chats with your token, email is spelled wrong -> 400", async () => {
      const wrongURL = `${process.env.BASE_URL}/chats/private/anakinmail.com`;
      const response = await request(app)
        .get(wrongURL)
        .set("Authorization", anakinToken);
      expect(response.status).toBe(400);
    });
  });
});
