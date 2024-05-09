import request from "supertest";
import app  from "../index.js";

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
    await request(app).get(`${process.env.BASE_URL}/auth/verify/${this.email}`).send();
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

export default User;
