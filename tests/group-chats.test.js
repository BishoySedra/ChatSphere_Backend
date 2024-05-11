import request from "supertest";
import app from "../index.js";
import User from "./user.js";

import env from "dotenv";
env.config();

const elizabeth = new User("Elizabeth", "elizabeth@mail.com", "Password@123");
const darcy = new User("Darcy", "darcy@mail.com", "Password@123");
const wickham = new User("Wickham", "wickham@mail.com", "Password@123");

await elizabeth.register();
await darcy.register();
await wickham.register();

const elizabethToken = await elizabeth.getToken();
const darcyToken = await darcy.getToken();
const wickhamToken = await wickham.getToken();

console.log("LIZ TOKEN ", elizabethToken);

await elizabeth.sendFriendRequest(darcy.email);
await darcy.respondToFriendRequest(elizabeth.email);
await elizabeth.getPrivateChats(elizabeth.email);
await elizabeth.sendFriendRequest(wickham.email);
await wickham.respondToFriendRequest(elizabeth.email);

const createGroupURL = `${process.env.BASE_URL}/chats/groups/create`;
const addFriendToGroupURL = `${process.env.BASE_URL}/chats/groups/add-friend`;

//let groupID;

// Cases =>
// 1. Elizabeth creates a group chat -> 200
// 2. Elizabeth tries to create a group with missing fields -> 400
//   - groupName missing
//   - groupDescription missing
//   - adminEmail missing
// 3. Elizabeth adds Darcy to the group -> 200
// 4. Elizabeth tries to add Darcy to the group with missing fields -> 400
//  - groupID missing
//  - friendEmail missing
//  - adminEmail missing
// 5. Elizabeth tries to add Darcy to the group with wrong groupID non-existent group -> 400
// 6. Elizabeth tries to add Darcy to the group with wrong friendEmail -> 404
// 7. Wickham tries to add Darcy to the group -> 403
//
//
//   const groupID = await elizabeth.createGroup(
//        "Pride and Prejudice",
//      "A group chat for discussing the novel",
//     );

describe("Group chats tests", () => {
  describe("Group Creation", () => {
    it("Create a group chat -> 200", async () => {
      const res = await request(app)
        .post(createGroupURL)
        .set("Authorization", elizabethToken)
        .send({
          adminEmail: elizabeth.email,
          groupName: "Pride and Prejudice",
          groupDescription: "A group chat for discussing the novel",
        });
      //groupID = res.body.body;
      expect(res.status).toBe(200);
    });

    it("Create a group chat with missing fields -> 400", async () => {
      const possibleResponses = [
        {
          adminEmail: elizabeth.email,
          groupName: "Pride and Prejudice",
          groupDescription: null,
        },
        {
          adminEmail: elizabeth.email,
          groupName: null,
          groupDescription: "A group chat for discussing the novel",
        },
        {
          adminEmail: null,
          groupName: "Pride and Prejudice",
          groupDescription: "A group chat for discussing the novel",
        },
      ];

      for (const testCase of possibleResponses) {
        const res = await request(app)
          .post(createGroupURL)
          .set("Authorization", elizabethToken)
          .send(testCase);
        expect(res.status).toBe(400);
      }
    });
  });

  describe("Add friend to group", () => {
    it("Add friend to group -> 200", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", elizabethToken)
        .send({
          adminEmail: elizabeth.email,
          userEmail: darcy.email,
          chatID: groupID,
        });
      console.log("GROUP ID ", groupID);
      expect(res.status).toBe(200);
    });

    it("Add friend to group with missing fields -> 400", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const possibleResponses = [
        { adminEmail: elizabeth.email, groupID, friendEmail: null },
        {
          adminEmail: elizabeth.email,
          userEmail: darcy.email,
          chatID: null,
        },
        { adminEmail: null, userEmail: darcy.email, chatID: groupID },
      ];

      for (const testCase of possibleResponses) {
        const res = await request(app)
          .post(addFriendToGroupURL)
          .set("Authorization", elizabethToken)
          .send(testCase);
        expect(res.status).toBe(400);
      }
    });

    it("Add friend to group with wrong groupID format -> 400", async () => {
      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", elizabethToken)
        .send({
          adminEmail: elizabeth.email,
          userEmail: darcy.email,
          chatID: "wrongID",
        });

      expect(res.status).toBe(400);
    });

    it("Add friend to group with wrong groupID non-existent group -> 404", async () => {
      await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );
      const groupID = "313233343536373839303132";
      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", elizabethToken)
        .send({
          adminEmail: elizabeth.email,
          userEmail: darcy.email,
          chatID: groupID,
        });
      expect(res.status).toBe(404);
    });

    it("Add friend to group with wrong friendEmail -> 404", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", elizabethToken)
        .send({
          adminEmail: elizabeth.email,
          userEmail: "notDarcy@mail.com",
          chatID: groupID,
        });
      expect(res.status).toBe(404);
    });

    it("User not in group trying to add another user, both are not friends -> 403", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", wickhamToken)
        .send({
          adminEmail: wickham.email,
          userEmail: darcy.email,
          chatID: groupID,
        });
      expect(res.status).toBe(403);
    });

    it("User not in group trying to add another user, both are friends -> 403", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      await darcy.sendFriendRequest(wickham.email);
      await wickham.respondToFriendRequest(darcy.email);

      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", wickhamToken)
        .send({
          adminEmail: wickham.email,
          userEmail: darcy.email,
          chatID: groupID,
        });
      expect(res.status).toBe(403);
    });

    it("User in group trying to add another user, both are not friends -> 403", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      await elizabeth.addFriendToGroup(groupID, wickham.email);

      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", wickhamToken)
        .send({
          adminEmail: wickham.email,
          userEmail: darcy.email,
          chatID: groupID,
        });
      expect(res.status).toBe(403);
    });
  });
});
