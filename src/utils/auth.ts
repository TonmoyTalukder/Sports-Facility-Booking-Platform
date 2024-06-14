import jwt from 'jsonwebtoken';
import config from '../config';

export const generateToken = (userId: string) => {

  if (!config.jwt_secret) {
    throw new Error('JWT secret is not defined'); // Optional additional check
  }

  return jwt.sign({ id: userId }, config.jwt_secret, {
    expiresIn: '30d',
  });
};
