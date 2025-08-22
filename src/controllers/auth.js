import * as userService from "../services/auth.js";

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const register = async (req, res, next) => {
  try {
    // Get domain and protocol for verification link
    const protocol = req.protocol;
    const domain = req.get("host");
    const imageBuffer = req.file ? req.file.buffer : null;

    const user = await userService.registerService(req.body, imageBuffer, domain, protocol);

    return res.status(201).json({
      body: user,
      status: 201,
      message: "User registered successfully! Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const login = async (req, res, next) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress;
    const token = await userService.loginService(req.body, clientIp);
    
    return res.json({
      body: token,
      status: 200,
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user email address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    await userService.verifyEmailService(email);
    
    // Return HTML response for user-friendly email verification
    return res.send("<h1>Email verified successfully!</h1>");
  } catch (error) {
    next(error);
  }
};
