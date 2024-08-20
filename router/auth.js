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
    .withMessage('password should be at least 5 characters'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('nickname').trim().notEmpty().withMessage('name is missing'),
  validate,
];

router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.login);

// router.get('/signout', isAuth, authController.me);

module.exports = router;
