import request from "supertest";
import app from "../starter.js";

const registerURL = `${process.env.BASE_URL}/auth/register`;
const loginURL = `${process.env.BASE_URL}/auth/login`;

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  register = async () => {
    await request(app).post(registerURL).send({
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

  getToken = async () => {
    const res = await this.login();
    return "Bearer " + res.body;
  };

  sendFriendRequest = async (receiverMail) => {
    const sendFriendRequestURL = `${process.env.BASE_URL}/users/${this.email}/send/${receiverMail}`;
    await request(app)
      .post(sendFriendRequestURL)
      .set("Authorization", await this.getToken());
  };

  respondToFriendRequest = async (senderMail, state) => {
    const respondToFriendRequestURL = `${process.env.BASE_URL}/users/${this.email}/response/${senderMail}`;
    await request(app)
      .post(respondToFriendRequestURL)
      .set("Authorization", await this.getToken())
      .send({ status: state });
  };

  unfriend = async (friendEmail) => {
    const unfriendURL = `${process.env.BASE_URL}/users/${this.email}/unfriend/${friendEmail}`;
    await request(app)
      .patch(unfriendURL)
      .set("Authorization", await this.getToken());
  };

  getPrivateChats = async (mail = this.email) => {
    const privateChatsURL = `${process.env.BASE_URL}/chats/private/${mail}`;
    const response = await request(app)
      .get(privateChatsURL)
      .set("Authorization", await this.getToken());
    return response.body.body[0]._id;
  };

  createGroup = async (groupName, groupDescription) => {
    const createGroupURL = `${process.env.BASE_URL}/chats/groups/create`;
    const res = await request(app)
      .post(createGroupURL)
      .set("Authorization", await this.getToken())
      .send({
        adminEmail: this.email,
        groupName,
        groupDescription,
      });
    return res.body.body;
  };

  addFriendToGroup = async (groupID, friendEmail) => {
    const addFriendToGroupURL = `${process.env.BASE_URL}/chats/groups/add-friend`;
    await request(app)
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
