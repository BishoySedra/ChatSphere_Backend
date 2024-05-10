import * as userService from "../services/auth.js";

// user will give username, email, password
export const register = async (req, res, next) => {
  try {
    // get the domain name and the protocol from the request
    const protocol = req.protocol;
    const domain = req.get("host");

    const user = await userService.registerService(req.body, domain, protocol);

    return res.status(201).json({
      body: user,
      status: 201,
      message: "User registered successfully! Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await userService.loginService(req.body);
    return res.json({
      body: token,
      status: 200,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    await userService.verifyEmailService(email);
    // return res.json({
    //   status: 200,
    //   message: "Email verified successfully!",
    // });
    // return html response that email is verified
    return res.send("<h1>Email verified successfully!</h1>");
  } catch (error) {
    next(error);
  }
};
