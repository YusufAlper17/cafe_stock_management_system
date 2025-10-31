const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const verifyToken = (req, res, next) => {
  try {
    // Token'ı header'dan al
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token is missing.'
      });
    }

    // Bearer token'ı ayır
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization header format.'
      });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, config.secret);

    // Kullanıcı bilgilerini request'e ekle
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      store_id: decoded.store_id
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};

module.exports = {
  verifyToken
};
