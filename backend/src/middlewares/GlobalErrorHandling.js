import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";

const globalErrorHandling = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of AppError, create one
  if (!(error instanceof AppError)) {
    const statusCode = error instanceof mongoose.Error ? 400 : 500;
    const message =
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : error.message || "Internal Server Error";
    error = new AppError(statusCode, message);
  }

  // Prepare the error response
  const response = {
    statusCode: error.statusCode,
    success: error.success,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  res.status(response.statusCode).json(response);
};

export { globalErrorHandling };
