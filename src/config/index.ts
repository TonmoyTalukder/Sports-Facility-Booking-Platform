import dotenv from 'dotenv';
dotenv.config();

const Port = process.env.PORT || '5000';

const DB_url = process.env.DB_URL;
if (!DB_url) {
  console.warn("Warning: DB_URL environment variable is not set. Using default.");
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in the environment variables');
}

export default {
  port: Port,
  db_url: DB_url,
  jwt_secret: jwtSecret,
};
