import { env } from "../config/env.js";

export function errorMiddleware(err, req, res, next) {
  let status = err.statusCode || err.status || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(". ");
  } else if (err.code === 11000) {
    status = 409;
    message = "Email already in use";
  }

  if (status === 500 && env.nodeEnv === "production") {
    message = "Internal server error";
  }
  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(env.nodeEnv !== "production" && err.stack && { stack: err.stack }),
  });
}
