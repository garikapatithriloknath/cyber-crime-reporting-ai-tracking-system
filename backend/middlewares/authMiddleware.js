import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Protect middleware: Ensures incoming request has a valid JWT Bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid or expired token.',
        error: error.message,
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided.',
    });
  }
};

/**
 * Admin authorization middleware: Requires user role to be 'admin'
 */
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Access restricted to authorized administrative personnel.',
  });
};
