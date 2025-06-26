// server/config.js
import dotenv from 'dotenv';
dotenv.config();

const config = {
  // runtime environment
  env:       process.env.NODE_ENV || 'development',

  // which port to listen on
  port:      Number(process.env.PORT) || 3000,

  // our JWT signing secret (fallback only used if you forget to set JWT_SECRET)
  jwtSecret: process.env.JWT_SECRET || 'sigma-secret',

  // MongoDB connection string (MUST be set in .env)
  mongoUri:  process.env.MONGODB_URI
};

export default config;
