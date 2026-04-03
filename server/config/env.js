import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];

export function validateEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.warn(
      `[env] Recommended: set ${missing.join(", ")} in .env (defaults are used for local dev only).`
    );
  }
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.JWT_SECRET || process.env.JWT_SECRET === "dev-only-change-in-production")
  ) {
    console.error(
      "[env] JWT_SECRET must be set to a strong secret in production."
    );
    process.exit(1);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/file-sharing-systems",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  maxFileSizeBytes:
    Number(process.env.MAX_FILE_SIZE_BYTES) || 25 * 1024 * 1024,
};
