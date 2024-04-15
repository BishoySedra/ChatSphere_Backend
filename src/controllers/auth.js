import * as userService from "../services/auth.js";

// user will give username, email, password
export const register = async (req, res, next) => {
  try {
    const user = await userService.registerService(req.body);

    return res.status(201).json({
      body: user,
      status: 201,
      message: "User registered successfully!",
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

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.json({
      body: users,
      status: 200,
      message: "All users fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};
