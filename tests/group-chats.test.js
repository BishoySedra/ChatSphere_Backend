import request from "supertest";
import app from "../index.js";
import User from "./user.js";
import mongoose from "mongoose";
import connetDB, { clearAllCollections } from "../src/db/connection.js";

import env from "dotenv";
env.config();

await clearAllCollections(mongoose.connection);

const elizabeth = new User("Elizabeth", "elizabeth@mail.com", "Password@123");
const darcy = new User("Darcy", "darcy@mail.com", "Password@123");
const wickham = new User("Wickham", "wickham@mail.com", "Password@123");
const lydia = new User("Lydia", "lydia@mail.com", "Password@123");
const bingley = new User("Bingley", "bingley@mail.com", "Password@123");

await elizabeth.register();
await darcy.register();
await wickham.register();
await lydia.register();
await bingley.register();

const elizabethToken = await elizabeth.getToken();
const darcyToken = await darcy.getToken();
const wickhamToken = await wickham.getToken();
const lydiaToken = await lydia.getToken();
const bingleyToken = await bingley.getToken();

//console.log("LIZ TOKEN ", elizabethToken);

await elizabeth.sendFriendRequest(darcy.email);
await darcy.respondToFriendRequest(elizabeth.email, "ACCEPTED");
await elizabeth.getPrivateChats(elizabeth.email);
await elizabeth.sendFriendRequest(wickham.email);
await wickham.respondToFriendRequest(elizabeth.email, "ACCEPTED");
await wickham.sendFriendRequest(lydia.email);
await lydia.respondToFriendRequest(wickham.email, "ACCEPTED");

const createGroupURL = `${process.env.BASE_URL}/chats/groups/create`;
const addFriendToGroupURL = `${process.env.BASE_URL}/chats/groups/add-friend`;

//let groupID;

//

describe("Group chats tests", () => {
  describe("Group Creation", () => {
    // Cases =>
    // 1. Elizabeth creates a group chat -> 200
    // 2. Elizabeth tries to create a group with missing fields -> 400
    //   - groupName missing
    //   - groupDescription missing
    //   - adminEmail missing

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

  describe("Add someone to group", () => {
    // Cases =>
    // 1. Elizabeth adds Darcy to the group -> 200
    // 2. Elizabeth tries to add Darcy to the group with missing fields -> 400
    //  - groupID missing
    //  - friendEmail missing
    //  - adminEmail missing
    // 3. Elizabeth tries to add Darcy to the group with wrong groupID non-existent group -> 400
    // 4. Elizabeth tries to add Darcy to the group with wrong friendEmail -> 404
    // 5. Wickham tries to add Darcy to the group -> 403

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
      //console.log("GROUP ID ", groupID);
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
          adminEmail: bingley.email,
          userEmail: lydia.email,
          chatID: groupID,
        });
      expect(res.status).toBe(403);
    });

    it("User not in group trying to add another user, both are friends -> 403", async () => {
      await bingley.sendFriendRequest(lydia.email);
      await lydia.respondToFriendRequest(bingley.email, "ACCEPTED");

      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .post(addFriendToGroupURL)
        .set("Authorization", wickhamToken)
        .send({
          adminEmail: bingley.email,
          userEmail: lydia.email,
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
          userEmail: lydia.email,
          chatID: groupID,
        });
      //console.log("USER ADD FRIEND TO GROUP ", res.body);
      expect(res.status).toBe(403);
    });
  });

  describe("Get group details", () => {
    // Cases =>
    // 1. Elizabeth, the admin, gets group details -> 200
    // 2. Elizabeth tries to get group details with missing group ID -> 400
    // 3. Elizabeth tries to get group details with wrong group ID format -> 400
    // 4. Elizabeth tries to get group details for a non-existent group -> 404
    // 5. Wickham, who isn't in the group, tries to get group details -> 403
    // 6. Darcy, who is in the group, tries to get group details -> 200
    //

    it("Get group details -> 200", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .get(`${process.env.BASE_URL}/chats/groups/details/${groupID}`)
        .set("Authorization", elizabethToken);
      //console.log("GROUP DETAILS ", res.body);
      expect(res.status).toBe(200);
    });

    it("Get group details with missing group ID -> 400", async () => {
      const res = await request(app)
        .get(`${process.env.BASE_URL}/chats/groups/details/`)
        .set("Authorization", elizabethToken);
      expect(res.status).toBe(400);
    });

    it("Get group details with wrong group ID format -> 400", async () => {
      const res = await request(app)
        .get(`${process.env.BASE_URL}/chats/groups/details/wrongID`)
        .set("Authorization", elizabethToken);
      expect(res.status).toBe(400);
    });

    it("Get group details for a non-existent group -> 404", async () => {
      const res = await request(app)
        .get(
          `${process.env.BASE_URL}/chats/groups/details/313233343536373839303132`,
        )
        .set("Authorization", elizabethToken);
      expect(res.status).toBe(404);
    });

    it("User not in group trying to get group details -> 403", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .get(`${process.env.BASE_URL}/chats/groups/details/${groupID}`)
        .set("Authorization", lydiaToken);
      expect(res.status).toBe(403);
    });

    it("User in group trying to get group details -> 200", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const addDarcy = await elizabeth.addFriendToGroup(groupID, darcy.email);

      const res = await request(app)
        .get(`${process.env.BASE_URL}/chats/groups/details/${groupID}`)
        .set("Authorization", darcyToken);
      expect(res.status).toBe(200);
    });
  });

  describe("Delete group", () => {
    // Cases =>
    // 1. Elizabeth, the admin, deletes the group -> 200
    // 2. Elizabeth tries to delete the group with missing group ID -> 400
    // 3. Elizabeth tries to delete the group with wrong group ID format -> 400
    // 4. Elizabeth tries to delete a non-existent group -> 404
    // 5. Elizabeth tries to delete the group, without passing admin email -> 400
    // 5. Lydia, who isn't in the group, tries to delete the group -> 403
    // 6. Darcy, who is in the group, tries to delete the group -> 403

    it("Delete group -> 200", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .delete(`${process.env.BASE_URL}/chats/groups/${groupID}`)
        .set("Authorization", elizabethToken)
        .send({
          email: elizabeth.email,
        });
      expect(res.status).toBe(200);
    });

    it("Delete group with missing group ID -> 400", async () => {
      const emptyID = null;
      const res = await request(app)
        .delete(`${process.env.BASE_URL}/chats/groups/${emptyID}`)
        .set("Authorization", elizabethToken)
        .send({
          email: elizabeth.email,
        });
      //console.log("DELETE GROUP ", res.body);
      expect(res.status).toBe(400);
    });

    it("Delete group with wrong group ID format -> 400", async () => {
      const res = await request(app)
        .delete(`${process.env.BASE_URL}/chats/groups/wrongID`)
        .set("Authorization", elizabethToken)
        .send({
          email: elizabeth.email,
        });
      expect(res.status).toBe(400);
    });

    it("Delete non-existent group -> 404", async () => {
      const res = await request(app)
        .delete(`${process.env.BASE_URL}/chats/groups/313233343536373839303132`)
        .set("Authorization", elizabethToken)
        .send({
          email: elizabeth.email,
        });
      expect(res.status).toBe(404);
    });

    it("Delete group without passing admin email -> 400", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .delete(`${process.env.BASE_URL}/chats/groups/${groupID}`)
        .set("Authorization", elizabethToken)
        .send({
          email: null,
        });
      expect(res.status).toBe(400);
    });

    it("User not in group trying to delete group -> 403", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      const res = await request(app)
        .delete(`${process.env.BASE_URL}/chats/groups/${groupID}`)
        .set("Authorization", lydiaToken)
        .send({
          email: lydia.email,
        });
      expect(res.status).toBe(403);
    });

    it("User in group trying to delete group -> 403", async () => {
      const groupID = await elizabeth.createGroup(
        "Pride and Prejudice",
        "A group chat for discussing the novel",
      );

      await elizabeth.addFriendToGroup(groupID, darcy.email);

      const res = await request(app)
        .delete(`${process.env.BASE_URL}/chats/groups/${groupID}`)
        .set("Authorization", darcyToken)
        .send({
          email: darcy.email,
        });
      expect(res.status).toBe(403);
    });
  });
});
