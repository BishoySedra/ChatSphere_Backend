import { CustomError } from "./customError.js";

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      message: error.message,
      body: error.body,
      status: error.statusCode,
    });
  }
  return res.status(500).json({ msg: error.details, status: 500, body: null });
};

export default errorHandler;
