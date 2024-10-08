const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('express-async-errors');
const userRepository = require('../model/auth.js');
const { config } = require('../config.js');

async function signup(req, res) {
  const { email, password, age, nickname, sex, spicy, capacity, allergies, role } = req.body;
  const found = await userRepository.findByEmail(email);
  if (found) {
    return res.status(409).json({ message: `이미 존재하는 ${email} 입니다.` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    email,
    password: hashed,
    age,
    nickname,
    sex,
    spicy,
    capacity,
    role,
  }, allergies);
  const token = createJwtToken(userId);
  res.set('X-User-Role', user.role ? user.role : 'user');
  res.status(201).json({ token, username: nickname });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return res.status(401).json({ message: '유효하지 않은 아이디/비밀번호입니다.' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: '유효하지 않은 아이디/비밀번호입니다.' });
  }
  const token = createJwtToken(user.id);
  res.set('X-User-Role', user.role ? user.role : 'user');
  res.status(200).json({ token, username : user.nickname });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    // expiresIn: config.jwt.expiresInSec,
  });
}

// async function me(req, res, next) {
//   const user = await userRepository.findById(req.userId);
//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }
//   res.status(200).json({ token: req.token, username: user.username });
// }

module.exports = {
  signup,
  login,
  // me
};
