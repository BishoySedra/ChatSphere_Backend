import request from "supertest";
import app from "../index.js";
import User from "./user.js";
import mongoose from "mongoose";
import connetDB, { clearAllCollections } from "../src/db/connection.js";

import env from "dotenv";
import sendEmail from "../src/helpers/emailSending.js";
env.config();

await clearAllCollections(mongoose.connection);

const alice = new User("Alice", "alice@mail.com", "Password@123");
const bob = new User("Bob", "bob@mail.com", "Password@123");
const john = new User("John", "john@mail.com", "Password@123");
const jane = new User("Jane", "jane@mail.com", "Password@123");
const shepard = new User("Shepard", "shepard@mail.com", "Password@123");
const liara = new User("Liara", "liara@mail.com", "Password@123");
const garrus = new User("Garrus", "garrus@mail.com", "Password@123");
const tali = new User("Tali", "tali@mail.com", "Password@123");

await alice.register();
await bob.register();
await john.register();
await jane.register();
await shepard.register();
await liara.register();
await garrus.register();
await tali.register();

const aliceToken = await alice.getToken();
const bobToken = await bob.getToken();
const johnToken = await john.getToken();
const janeToken = await jane.getToken();
const shepardToken = await shepard.getToken();
const liaraToken = await liara.getToken();
const garrusToken = await garrus.getToken();
const taliToken = await tali.getToken();

//  401 -> token not provided
//  403 -> token is weak, not authorized to access the resource
//  400 -> Bad Request, format is weak
//

describe("Friend Management", () => {
  describe("Send Friend Request", () => {
    //  Cases:==>
    //  1. Send Friend Request correctly -> 200
    //  2. Send Friend Request without token -> 401
    //  3. Send Friend Request with wrong token -> 403
    //  4. Send Friend Request with non-existing token -> 400
    //  5. Send friend request to yourself -> 400
    //  6. Send friend request to a friend -> 400
    //  7. Send friend request to a non-existing user -> 404
    //  8. Send friend request from a non-existing user -> 404

    const senderMail = alice.email;
    const receiverMail = bob.email;
    const correctApiURL = `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`;

    //all is well
    it("should send a friend request -> 200", async () => {
      const res = await request(app)
        .post(correctApiURL)
        .set("Authorization", aliceToken);
      //console.log("SHOULD SEND FR ", res.body);
      expect(res.statusCode).toEqual(200);
    });

    it("should not send a friend request, using no token -> 401", async () => {
      const res = await request(app).post(correctApiURL);
      //console.log("SHOULD NOT SEND FR NO TOKEN ", res.body);
      expect(res.statusCode).toEqual(401);
    });

    it("should not send a friend request, not using your token -> 403", async () => {
      const res = await request(app)
        .post(correctApiURL)
        .set("Authorization", bobToken);
      //console.log("SHOULD NOT SEND FR WRONG TOKEN ", res.body);
      expect(res.statusCode).toEqual(403);
    });

    it("should not send a friend request, using a not assigned token -> 400", async () => {
      const res = await request(app)
        .post(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken");
      //console.log("SHOULD NOT SEND FR UNASSIGNED TOKEN ", res.body);
      expect(res.statusCode).toEqual(400);
    });

    it("should not send a friend request, to yourself -> 400", async () => {
      const res = await request(app)
        .post(`${process.env.BASE_URL}/users/${senderMail}/send/${senderMail}`)
        .set("Authorization", aliceToken);
      //console.log("SHOULD NOT SEND FR TO YOURSELF ", res.body);
      expect(res.statusCode).toEqual(400);
    });

    it("should not send a friend request, non-existing reciever, wrong sender token -> 404", async () => {
      const res = await request(app)
        .post(`${process.env.BASE_URL}/users/${senderMail}/send/wrong@mail.com`)
        .set("Authorization", bobToken);
      expect(res.statusCode).toEqual(404);
    });

    it("should not send a friend request, non-existing reciever, non-existing sender -> 404", async () => {
      const res = await request(app)
        .post(
          `${process.env.BASE_URL}/users/wrong@mail.com/send/${receiverMail}`,
        )
        .set("Authorization", bobToken);
      expect(res.statusCode).toEqual(404);
    });

    it("should not send a friend request, already friends -> 400", async () => {
      const friendRequest = await request(app)
        .post(correctApiURL)
        .set("Authorization", aliceToken);
      const wrongRequest = await request(app)
        .post(correctApiURL)
        .set("Authorization", aliceToken);
      //console.log("WRONG REQUEST ALREADY FRIENDS ", wrongRequest.body);
      expect(wrongRequest.statusCode).toEqual(400);
    });
  });

  describe("Accept Friend Request", () => {
    //  Cases:==>
    // 1. Accept a friend request -> 200
    // 2. Accept a friend request using no token -> 401  ---- fails
    // 3. Accept a friend request without using your token -> 403 ---- fails
    // 4. Accept a friend request with non-existing token -> 400
    // 5. Accept a friend request from a non-existing user -> 404

    const senderMail = john.email;
    const receiverMail = jane.email;
    const senderToken = johnToken;
    const receiverToken = janeToken;

    const correctApiURL = `${process.env.BASE_URL}/users/${receiverMail}/response/${senderMail}`;
    it("should accept a friend request -> 200", async () => {
      await john.sendFriendRequest(jane.email);
      //console.log("JOHN REQUEST ", friendRequest.text);
      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", receiverToken)
        .send({ status: "ACCEPTED" });
      //console.log("JANE RESPONSE ", friendResponse);
      expect(friendResponse.statusCode).toEqual(200);
    });

    it("should not accept a friend request, using a not assigned token -> 400", async () => {
      //await john.sendFriendRequest(jane.email);
      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken")
        .send({ status: "ACCEPTED" });
      expect(friendResponse.statusCode).toEqual(400);
    });

    it("should not accept a friend request, non-existing sender -> 404", async () => {
      //await john.sendFriendRequest(jane.email);
      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${receiverMail}/response/wrong@mail.com`,
        )
        .set("Authorization", receiverToken)
        .send({ status: "ACCEPTED" });
      expect(friendResponse.statusCode).toEqual(404);
    });

    it("should not accept a friend request, non-existing reciever -> 404", async () => {
      //await john.sendFriendRequest(jane.email);
      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/wrong@mail.com/response/${senderMail}`,
        )
        .set("Authorization", receiverToken)
        .send({ status: "ACCEPTED" });
    });
  });

  describe("Reject Friend Request", () => {
    //  Cases:==>
    // 1. Reject a friend request -> 200
    // 2. Reject a friend request using no token -> 401
    // 3. Reject a friend request without using your token -> 403
    // 4. Reject a friend request with non-existing token -> 400
    // 5. Reject a friend request from a non-existing user -> 404
    // 6. Reject a friend request that does not exist -> 404

    const senderMail = shepard.email;
    const receiverMail = liara.email;
    const senderToken = shepardToken;
    const receiverToken = liaraToken;

    const correctApiURL = `${process.env.BASE_URL}/users/${receiverMail}/response/${senderMail}`;

    it("should reject a friend request -> 200", async () => {
      await shepard.sendFriendRequest(liara.email);
      //console.log("SHPARD REQUEST ", friendRequest.body);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", receiverToken)
        .send({ status: "REJECTED" });
      //console.log("LIARA RESPONSE ", friendResponse);
      expect(friendResponse.statusCode).toEqual(200);
    });

    it("should not reject a friend request, using no token -> 401", async () => {
      //await shepard.sendFriendRequest(liara.email);
      const friendResponse = await request(app)
        .post(correctApiURL)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(401);
    });

    it("should not reject a friend request, not using your token -> 403", async () => {
      //await shepard.sendFriendRequest(liara.email);
      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", senderToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(403);
    });

    it("should not reject a friend request, using a not assigned token -> 400", async () => {
      //await shepard.sendFriendRequest(liara.email);
      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken")
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(400);
    });

    it("should not reject a friend request, non-existing sender -> 404", async () => {
      //await shepard.sendFriendRequest(liara.email);
      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${receiverMail}/response/wrong@mail.com`,
        )
        .set("Authorization", receiverToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(404);
    });

    it("should not reject a friend request, non-existing reciever -> 404", async () => {
      //await shepard.sendFriendRequest(liara.email);
      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/wrong@mail.com/response/${senderMail}`,
        )
        .set("Authorization", receiverToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(404);
    });

    it("should not reject a friend request, non-existing friend request -> 404", async () => {
      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${receiverMail}/response/wrong@mail.com`,
        )
        .set("Authorization", receiverToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(404);
    });
  });

  describe("Get All Friends", () => {
    //  Cases:==>
    // 1. Get all friends -> 200
    // 2. Get all friends using no token -> 401
    // 3. Get all friends without using your token -> 403
    // 4. Get all friends with non-existing token -> 400
    // 5. Get all friends from a non-existing user -> 404

    const userMail = alice.email;
    const correctApiURL = `${process.env.BASE_URL}/users/${userMail}/friends`;
    it("should get all friends -> 200", async () => {
      const res = await request(app)
        .get(correctApiURL)
        .set("Authorization", aliceToken);
      //console.log("ALICE ", alice.username, alice.email, aliceToken);
      //console.log("GET ALL FRIENDS ", res.body);
      expect(res.statusCode).toEqual(200);
    });

    it("should not get all friends, using no token -> 401", async () => {
      const res = await request(app).get(correctApiURL);
      expect(res.statusCode).toEqual(401);
    });

    it("should not get all friends, not using your token -> 403", async () => {
      const res = await request(app)
        .get(correctApiURL)
        .set("Authorization", bobToken);
      expect(res.statusCode).toEqual(403);
    });

    it("should not get all friends, using a not assigned token -> 400", async () => {
      const res = await request(app)
        .get(correctApiURL)
        .set("Authorization", "evilToken");
      expect(res.statusCode).toEqual(400);
    });

    it("should not get all friends, non-existing user -> 403", async () => {
      const res = await request(app)
        .get(`${process.env.BASE_URL}/users/evil@mail.com/friends`)
        .set("Authorization", aliceToken);
      console.log("GET ALL FRIENDS NON-EXISTING USER ", res.body);
      expect(res.statusCode).toEqual(403);
    });
  });

  describe("Unfriend", () => {
    //  Cases:==>
    //  1. Alice tries to unfriend Bob using Alice's token, they're both friends -> 200
    //  2. Alice tries to unfriend Bob using no token -> 401
    //  3. Bob tries to unfriend Alice using Bob's token -> 403
    //  4. Alice tries to unfriend Bob using a not assigned token -> 400
    //  5. Alice tries to unfriend Luke, a non-existing user -> 404
    //  6. Alice tries to unfriend a Jane, that is not her friend -> 400
    //  7. Alice tries to unfriend herself -> 400
    //

    const senderMail = alice.email;
    const receiverMail = bob.email;
    const senderToken = aliceToken;
    const receiverToken = bobToken;

    const correctApiURL = `${process.env.BASE_URL}/users/${senderMail}/unfriend/${receiverMail}`;

    it("should unfriend -> 200", async () => {
      await alice.sendFriendRequest(bob.email);
      await bob.respondToFriendRequest(alice.email, "ACCEPTED");
      const res = await request(app)
        .patch(correctApiURL)
        .set("Authorization", aliceToken);
      //console.log("UNFRIEND ", res.body);
      expect(res.statusCode).toEqual(200);
    });

    it("should not unfriend, using no token -> 401", async () => {
      const res = await request(app).patch(correctApiURL);
      //console.log("UNFRIEND NO TOKEN ", res.body);
      expect(res.statusCode).toEqual(401);
    });

    it("should not unfriend, not using your token -> 403", async () => {
      const res = await request(app)
        .patch(correctApiURL)
        .set("Authorization", bobToken);
      expect(res.statusCode).toEqual(403);
    });

    it("should not unfriend, using a not assigned token -> 400", async () => {
      const res = await request(app)
        .patch(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken");
      expect(res.statusCode).toEqual(400);
    });

    it("should not unfriend, non-existing user -> 404", async () => {
      const wrongApiURL = `${process.env.BASE_URL}/users/${senderMail}/unfriend/luke@mail.com`;
      const res = await request(app)
        .patch(wrongApiURL)
        .set("Authorization", aliceToken);
      expect(res.statusCode).toEqual(404);
    });

    it("should not unfriend, non-friend -> 404", async () => {
      const wrongApiURL = `${process.env.BASE_URL}/users/${senderMail}/unfriend/liara@mail.com`;
      const res = await request(app)
        .patch(wrongApiURL)
        .set("Authorization", aliceToken);
      expect(res.statusCode).toEqual(404);
    });

    it("should not unfriend, yourself -> 404", async () => {
      const wrongApiURL = `${process.env.BASE_URL}/users/${senderMail}/unfriend/${senderMail}`;
      const res = await request(app)
        .patch(wrongApiURL)
        .set("Authorization", aliceToken);
      //console.log("UNFRIEND YOURSELF ", res.body);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("Cancel Friend Request", () => {
    // Cases:==>
    // 1. Garrus tries to cancel a sent friend request to Tali, using Garrus' token -> 200
    // 2. Garrus tries to cancel a sent friend request to Tali, using no token -> 401
    // 3. Garrus tries to cancel a sent friend request to Tali, using Tali's token -> 403
    // 4. Garrus tries to cancel a sent friend request to Tali, using a not assigned token -> 400
    // 5. Garrus tries to cancel a sent friend request to a non-existing user -> 404
    // 6. Garrus tries to cancel a sent friend request to a friend -> 400
    // 7. Garrus tries to cancel a non-existing friend request -> 404
    //
    const senderMail = garrus.email;
    const receiverMail = tali.email;
    const senderToken = garrusToken;
    const receiverToken = taliToken;

    const correctApiURL = `${process.env.BASE_URL}/users/${senderMail}/cancel-friend-request/${receiverMail}`;

    it("should cancel a friend request -> 200", async () => {
      await garrus.sendFriendRequest(tali.email);
      const res = await request(app)
        .patch(correctApiURL)
        .set("Authorization", senderToken);
      //console.log("CANCEL FRIEND REQUEST ", res.body);
      expect(res.statusCode).toEqual(200);
    });

    it("should not cancel a friend request, using no token -> 401", async () => {
      const res = await request(app).patch(correctApiURL);
      //console.log("CANCEL FRIEND REQUEST NO TOKEN ", res.body);
      expect(res.statusCode).toEqual(401);
    });

    it("should not cancel a friend request, not using your token -> 403", async () => {
      const res = await request(app)
        .patch(correctApiURL)
        .set("Authorization", receiverToken);
      //console.log("CANCEL FRIEND REQUEST WRONG TOKEN ", res.body);
      expect(res.statusCode).toEqual(403);
    });

    it("should not cancel a friend request, using a not assigned token -> 400", async () => {
      const res = await request(app)
        .patch(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken");
      //console.log("CANCEL FRIEND REQUEST UNASSIGNED TOKEN ", res.body);
      expect(res.statusCode).toEqual(400);
    });

    it("should not cancel a friend request, non-existing user -> 404", async () => {
      const wrongUser = "luke@mail.com";
      const wrongApiURL = `${process.env.BASE_URL}/users/${senderMail}/cancel-friend-request/${wrongUser}`;
      const res = await request(app)
        .patch(wrongApiURL)
        .set("Authorization", senderToken);
      //console.log("CANCEL FRIEND REQUEST NON-EXISTING USER ", res.body);
      expect(res.statusCode).toEqual(404);
    });

    it("should not cancel a friend request, friend -> 400", async () => {
      await garrus.sendFriendRequest(tali.email);
      await tali.respondToFriendRequest(garrus.email, "ACCEPTED");
      const res = await request(app)
        .patch(correctApiURL)
        .set("Authorization", senderToken);
      //console.log("CANCEL FRIEND REQUEST FRIEND ", res.body);
      expect(res.statusCode).toEqual(400);
    });

    it("should not cancel a friend request, non-existing friend request -> 404", async () => {
      const wrongUser = alice.email;
      const wrongApiURL = `${process.env.BASE_URL}/users/${senderMail}/cancel-friend-request/${wrongUser}`;
      const res = await request(app)
        .patch(wrongApiURL)
        .set("Authorization", senderToken);
      //console.log("CANCEL FRIEND REQUEST NON-EXISTING FRIEND REQUEST ", res.body);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("Get All Friend Requests", () => {
    // Cases:==>
    // 1. Alice tries to get all friend requests, using Alice's token -> 200
    // 2. Alice tries to get all friend requests, using no token -> 401
    // 3. Alice tries to get all friend requests, using Bob's token -> 403
    // 4. Alice tries to get all friend requests, using a not assigned token -> 400
    // 5. Luke, a non-existing user,  tries to get all friend requests -> 404
    //

    const userMail = alice.email;
    const userToken = aliceToken;
    const correctApiURL = `${process.env.BASE_URL}/users/${userMail}/friend-requests`;

    it("should get all friend requests -> 200", async () => {
      const res = await request(app)
        .get(correctApiURL)
        .set("Authorization", userToken);
      //console.log("GET ALL FRIEND REQUESTS ", res.body);
      expect(res.statusCode).toEqual(200);
    });

    it("should not get all friend requests, using no token -> 401", async () => {
      const res = await request(app).get(correctApiURL);
      //console.log("GET ALL FRIEND REQUESTS NO TOKEN ", res.body);
      expect(res.statusCode).toEqual(401);
    });

    it("should not get all friend requests, not using your token -> 403", async () => {
      const res = await request(app)
        .get(correctApiURL)
        .set("Authorization", bobToken);
      //console.log("GET ALL FRIEND REQUESTS WRONG TOKEN ", res.body);
      expect(res.statusCode).toEqual(403);
    });

    it("should not get all friend requests, using a not assigned token -> 400", async () => {
      const wrongToken = "Bearer " + "evilToken";
      const res = await request(app)
        .get(correctApiURL)
        .set("Authorization", wrongToken);
      //console.log("GET ALL FRIEND REQUESTS UNASSIGNED TOKEN ", res.body);
      expect(res.statusCode).toEqual(400);
    });
  });
});
