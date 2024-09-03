const express = require('express');
require('express-async-errors');
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const authController = require('../controller/auth');
const { isAuth } = require('../middleware/auth');

const router = express.Router();

const validateCredential = [
  body('email').isEmail().normalizeEmail().withMessage('invalid email'),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('비밀번호는 최소 5자 이상이어야합니다.'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('nickname').trim().notEmpty().withMessage('닉네임을 입력해주세요'),
  validate,
];

router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.login);

// router.get('/signout', isAuth, authController.me);

module.exports = router;
