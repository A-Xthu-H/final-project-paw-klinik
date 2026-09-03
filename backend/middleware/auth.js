const jwt = require('jsonwebtoken');
const config = require('../config/env');
const sendResponse = require('../utils/response');

function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return sendResponse(res, { code: 401, success: false, message: 'Login diperlukan' });
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return sendResponse(res, { code: 401, success: false, message: 'Token tidak valid atau sudah kedaluwarsa' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) return sendResponse(res, { code: 403, success: false, message: 'Akses ditolak' });
    return next();
  };
}

module.exports = { requireAuth, requireRole };
