import request from "supertest";
import app from "../index.js";

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
    await request(app)
      .get(`${process.env.BASE_URL}/auth/verify/${this.email}`)
      .send();
  };

  login = async () => {
    const res = await request(app).post(loginURL).send({
      email: this.email,
      password: this.password,
    });
    return res.body;
  };

  async getToken() {
    const res = await this.login();
    const token = res.body;
    return "Bearer " + token;
  }

  // make static method to send friend request

  sendFriendRequest = async (receiverMail) => {
    const senderMail = this.email;
    const sendFriendRequestURL = `${process.env.BASE_URL}/users/${senderMail}/send/${receiverMail}`;
   // console.log("send URL ", sendFriendRequestURL);
    //console.log("TOKEN ", await this.getToken());
    const res = await request(app)
      .post(sendFriendRequestURL)
      .set("Authorization", await this.getToken());
    //console.log(`SEND ${this.email} ${receiverMail} ` + res.text);
  };

  respondToFriendRequest = async (senderMail, state) => {
    const receiverMail = this.email;
    const respondToFriendRequestURL = `${process.env.BASE_URL}/users/${receiverMail}/response/${senderMail}`;
    const res = await request(app)
      .post(respondToFriendRequestURL)
      .set("Authorization", await this.getToken())
      .send({ status: state });
    //console.log(`RESPOND ${this.email} ${senderMail} ` + res.text);
  };

  unfriend = async (friendEmail) => {
    const unfriendURL = `${process.env.BASE_URL}/users/${this.email}/unfriend/${friendEmail}`;
    const res = await request(app)
      .patch(unfriendURL)
      .set("Authorization", await this.getToken());
  };

  getPrivateChats = async (mail = this.email) => {
    const privateChatsURL = `${process.env.BASE_URL}/chats/private/${mail}`;
    const mfResponse = await request(app)
      .get(privateChatsURL)
      .set("Authorization", await this.getToken());
    return mfResponse.body.body[0]._id;
    //console.log("GET" + mfResponse.text);
  };

  createGroup = async (groupName, groupDescription) => {
    const createGroupURL = `${process.env.BASE_URL}/chats/groups/create`;
    const res = await request(app)
      .post(createGroupURL)
      .set("Authorization", await this.getToken())
      .send({
        adminEmail: this.email,
        groupName: groupName,
        groupDescription: groupDescription,
      });
    return res.body.body;
  };

  addFriendToGroup = async (groupID, friendEmail) => {
    const addFriendToGroupURL = `${process.env.BASE_URL}/chats/groups/add-friend`;
    const res = await request(app)
      .post(addFriendToGroupURL)
      .set("Authorization", await this.getToken())
      .send({
        adminEmail: this.email,
        userEmail: friendEmail,
        chatID: groupID,
      });
  };
}

export default User;
