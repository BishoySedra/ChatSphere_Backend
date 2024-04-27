import request from "supertest";
import app from "../index.js";

import env from "dotenv";
env.config();

const registerURL = `${process.env.BASE_URL}/auth/register`;
const loginURL = `${process.env.BASE_URL}/auth/login`;

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  register = async () => {
    const res = await request(app).post(registerURL).send({
      username: this.username,
      email: this.email,
      password: this.password,
    });
    console.log("REG" + res.body.message);
  };

  login = async () => {
    const res = await request(app).post(loginURL).send({
      email: this.email,
      password: this.password,
    });
    console.log("LOG" + res.body.message);
    return res.body;
  };

  async getToken() {
    const res = await this.login();
    const token = res.body;
    return "Bearer " + token;
  }
}

const alice = new User("Alice", "alice@mail.com", "Password@123");
const bob = new User("Bob", "bob@mail.com", "Password@123");

await alice.register();
await bob.register();

const aliceToken = await alice.getToken();
const bobToken = await bob.getToken();

const john = new User("John", "john@mail.com", "Password@123");
await john.register();
const johnToken = await john.getToken();

const jane = new User("Jane", "jane@mail.com", "Password@123");
await jane.register();
const janeToken = await jane.getToken();

console.log(aliceToken);

console.log(alice.username, alice.email, aliceToken);

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

    const senderMail = "alice@mail.com";
    const receiverMail = "bob@mail.com";
    const correctApiURL = `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`;

    //all is well
    it("should send a friend request -> 200", async () => {
      const res = await request(app)
        .post(correctApiURL)
        .set("Authorization", aliceToken);
      expect(res.statusCode).toEqual(200);
    });

    it("should not send a friend request, using no token -> 401", async () => {
      const res = await request(app).post(correctApiURL);
      expect(res.statusCode).toEqual(401);
    });

    it("should not send a friend request, not using your token -> 403", async () => {
      const res = await request(app)
        .post(correctApiURL)
        .set("Authorization", bobToken);
      expect(res.statusCode).toEqual(403);
    });

    it("should not send a friend request, using a not assigned token -> 400", async () => {
      const res = await request(app)
        .post(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken");
      expect(res.statusCode).toEqual(400);
    });

    it("should not send a friend request, to yourself -> 400", async () => {
      const res = await request(app)
        .post(`${process.env.BASE_URL}/users/${senderMail}/send/${senderMail}`)
        .set("Authorization", aliceToken);
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

    const senderMail = "alice@mail.com";
    const receiverMail = "bob@mail.com";
    const correctApiURL = `${process.env.BASE_URL}/users/${receiverMail}/response/${senderMail}`;
    it("should accept a friend request -> 200", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", aliceToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", bobToken)
        .send({ status: "ACCEPTED" });
      expect(friendResponse.statusCode).toEqual(200);
    });

    it("should not accept a friend request, using no token -> 401, will fail for now", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", aliceToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .send({ status: "ACCEPTED" });
      expect(friendResponse.statusCode).toEqual(401);
    });

    it("should not accept a friend request, not using your token -> 403, will fail for now", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", aliceToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", aliceToken)
        .send({ status: "ACCEPTED" });
      expect(friendResponse.statusCode).toEqual(403);
    });

    it("should not accept a friend request, using a not assigned token -> 400", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", aliceToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken")
        .send({ status: "ACCEPTED" });
      expect(friendResponse.statusCode).toEqual(400);
    });

    it("should not accept a friend request, non-existing sender -> 404", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", aliceToken);

      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${receiverMail}/response/wrong@mail.com`,
        )
        .set("Authorization", bobToken)
        .send({ status: "ACCEPTED" });
      expect(friendResponse.statusCode).toEqual(404);
    });

    it("should not accept a friend request, non-existing reciever -> 404", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", aliceToken);

      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/wrong@mail.com/response/${senderMail}`,
        )
        .set("Authorization", bobToken)
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

    const senderMail = john.email;
    const receiverMail = jane.email;
    const correctApiURL = `${process.env.BASE_URL}/users/${receiverMail}/response/${senderMail}`;

    it("should reject a friend request -> 200", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", johnToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", janeToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(200);
    });

    it("should not reject a friend request, using no token -> 401", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", johnToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(401);
    });

    it("should not reject a friend request, not using your token -> 403", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", johnToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", johnToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(403);
    });

    it("should not reject a friend request, using a not assigned token -> 400", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", johnToken);

      const friendResponse = await request(app)
        .post(correctApiURL)
        .set("Authorization", "Bearer " + "evilToken")
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(400);
    });

    it("should not reject a friend request, non-existing sender -> 404", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", johnToken);

      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${receiverMail}/response/wrong@mail.com`,
        )
        .set("Authorization", janeToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(404);
    });

    it("should not reject a friend request, non-existing reciever -> 404", async () => {
      const friendRequest = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`,
        )
        .set("Authorization", johnToken);

      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/wrong@mail.com/response/${senderMail}`,
        )
        .set("Authorization", janeToken)
        .send({ status: "REJECTED" });
      expect(friendResponse.statusCode).toEqual(404);
    });

    it("should not reject a friend request, non-existing friend request -> 404", async () => {
      const friendResponse = await request(app)
        .post(
          `${process.env.BASE_URL}/users/${receiverMail}/response/wrong@mail.com`,
        )
        .set("Authorization", janeToken)
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
      expect(res.statusCode).toEqual(403);
    });
  });
});
