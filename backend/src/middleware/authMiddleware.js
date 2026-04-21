const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const { errorResponse } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log('[DEBUG] Token received:', authHeader?.substring(0, 50));

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);

    console.log('[DEBUG] Token decoded:', decoded);

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    req.user = user;
    req.userId = user.id;

    console.log('[DEBUG] Auth middleware - userId:', user.id);

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, 'Authentication failed', 401);
  }
};

module.exports = authMiddleware;