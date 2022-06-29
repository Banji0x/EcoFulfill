const authController = require('../controllers/authController');
const { check } = require('express-validator');
const { Router } = require('express');
const authRoute = Router();

//GET REQUESTS
authRoute.get('/api/auth/register', authController.registerGET);

authRoute.get('/api/auth/login', authController.loginGET);

authRoute.get('/api/auth/logout', authController.logoutGET);

//POST REQUESTS
authRoute.post('/api/auth/register',
    [
        check('name')
            .exists()
            .withMessage('User name is required')
            .isString()
            .withMessage('User name must be a string')
            .isLength({ min: 3, max: 20 })
            .withMessage('minimum character length is 3')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('Invalid name format provided')
            .trim()
        ,
        check('email')
            .exists()
            .withMessage('Email address is required')
            .isEmail()
            .withMessage('Input must be a valid email address')
            .normalizeEmail()
        ,
        check('password')
            .exists()
            .withMessage('password is required')
            .isLength({ min: 6 })
            .withMessage('minimum password length must be at least 6 characters')
        // .isStrongPassword()
        // .withMessage('Password must be a strong password')
    ], authController.registerPOST);
authRoute.post('/api/auth/login',
    [
        check('email')
            .normalizeEmail()
    ]
    , authController.loginPOST);


//EXPORTS
module.exports = authRoute; 
