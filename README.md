# ChatSphere

Full-Stack Chat Application Project using ReactJS and NodeJS.

### STEPS TO RUN

Currently there are three enviroments
```(dev,test,local)```

To be able to use a DB you must use one of the previous enviroments in your script like this:

```npm run dev -- --enviroment=test``` for testing

```npm run dev -- --enviroment=dev``` for dev

apply the same thing for other scripts like ``npm test`` or ``npm start``

TO BE ADDED:

```npm run dev -- --enviroment=local``` for local

### Libraries and dependencies

#### Dependencies

* [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [body-parser](https://www.npmjs.com/package/body-parser)
* [cloudinary](https://www.npmjs.com/package/cloudinary)
* [commander](https://www.npmjs.com/package/commander)
* [cors](https://www.npmjs.com/package/cors)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [express](https://www.npmjs.com/package/express)
* [joi](https://www.npmjs.com/package/joi)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [multer v. 1.4.3](https://www.npmjs.com/package/multer/v/1.4.3) Note: this version is used because some conflict with the latest version
* [nodemailer](https://www.npmjs.com/package/nodemailer)
* [socket.io](https://www.npmjs.com/package/socket.io)
* [streamifier](https://www.npmjs.com/package/streamifier)

#### Dev Dependencies

* [jest](https://www.npmjs.com/package/jest)
* [nodemon](https://www.npmjs.com/package/nodemon)
* [supertest](https://www.npmjs.com/package/supertest)

### **IMPORTANT**
The `.env` contains all environment variables needed to run the project, a `.example.env` file is present with the fields needed, create a `.env` file based on the example and fill the fields with your credentials, **don't share these credentials publicly**

---

### Profiles

There are three different profiles available.

1. The *dev* environment.
2. the *test* environment.
3. the *local* environment.

---

### Front end

This repo contains the whole backend for ChatSphere, the frontend is in this [repo](), it is also refrenced above.

---

### Test modules

Test modules using the *jest* library for all APIs are available in the `tests` directory, to run the test use

```bash
npm run test -- --enviroment=test tests/{fileName}.test.js
# Example
npm run test -- --enviroment=test tests/groups.test.js 
```
