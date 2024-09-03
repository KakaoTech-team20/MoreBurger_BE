const express = require('express');
require('express-async-errors');
const multer = require('multer');
const { body, header } = require('express-validator');
const { validate } = require('../middleware/validator');
const burgerController = require('../controller/burgers.js');
const { isAuth, isSeller} = require('../middleware/auth');
const { s3Upload } = require('../middleware/aws.js');
const router = express.Router();

// Multer 설정 - 메모리에 파일을 저장
const upload = multer({ storage: multer.memoryStorage() });

// GET /tweets/:id
router.get('/:id', 
  isAuth, 
  burgerController.getBurger);
  

router.post('/burger', 
  isAuth, isSeller,
  upload.single('image'),
  s3Upload,
  burgerController.createBurger);


router.put('/:id', 
  isAuth, isSeller,
  upload.single('image'),
  s3Upload,
  burgerController.updateBurger);
  

router.delete('/:id', 
  isAuth, isSeller,
  burgerController.deleteBurger);

router.get('/', 
  isAuth, 
  burgerController.getBurgers);

module.exports = router;