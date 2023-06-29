const express = require('express');
const { body } = require('express-validator');

const userController = require('../controller/user');

const router = express.Router();

router.post('/signup', [

    body('name')
       .trim()
        .isAlpha(),

    body('email')
        .isEmail()
        .withMessage('Enter a valid Email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 5 })

], userController.SignIn);

router.post('/login', userController.LogIn);
router.post('/forgetPassword', userController.ForgetPass);
router.post('/verifyOtp', userController.VerifyOtp);
router.patch('/resetPass', userController.resetPass);

module.exports = router;
