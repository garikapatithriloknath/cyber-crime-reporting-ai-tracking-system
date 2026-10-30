import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generate a signed JWT token for an authenticated user
 * @param {Object} userPayload - User details containing _id, email, and role
 * @returns {string} Signed JWT token
 */
export const generateToken = (userPayload) => {
  return jwt.sign(
    {
      id: userPayload._id,
      email: userPayload.email,
      role: userPayload.role || 'citizen',
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
};

/**
 * Verify a given JWT token
 * @param {string} token - Bearer JWT token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
