import { CustomError } from "./customError.js";

/**
 * Global error handler middleware
 * @param {Error} error - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      message: error.message,
      body: error.body,
      status: error.statusCode,
    });
  }
  
  // Log unexpected errors for debugging
  console.error("Unexpected error:", error);
  
  return res.status(500).json({ 
    message: "Internal server error!", 
    status: 500, 
    body: null 
  });
};

export default errorHandler;
