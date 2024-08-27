const express = require('express');
require('express-async-errors');
const { body, header } = require('express-validator');
const { validate } = require('../middleware/validator');
const burgerController = require('../controller/burgers.js');
const { isAuth, isSeller} = require('../middleware/auth');

const router = express.Router();

  

// GET /tweets/:id
router.get('/:id', 
  isAuth, 
  burgerController.getBurger);
  

router.post('/:id', 
  isAuth, isSeller, 
  burgerController.createBurger);


router.put('/:id', 
  isAuth, isSeller, 
  burgerController.updateBurger);
  
  
router.delete('/:id', 
  isAuth, isSeller, 
  burgerController.deleteBurger);

router.get('/', 
  isAuth, 
  burgerController.getBurgers);

module.exports = router;