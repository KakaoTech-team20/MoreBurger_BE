const jwt = require('jsonwebtoken');
const { config } = require('../config.js');
const userRepository = require('../model/auth.js');

const AUTH_ERROR = { message: 'Authentication Error' };

const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).json(AUTH_ERROR);
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user && req.method !== 'GET') {
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id; // req.customData
    req.role = user.role ? user.role : 'user';
    res.set('role', user.role ? user.role : 'user');
    next();
  });
};

const isSeller = async (req, res, next) => {
  if (req.role !== 'seller') {
    return res.status(401).json(AUTH_ERROR);
  }
  next();
}
module.exports = {
  isAuth,
  isSeller,
};
