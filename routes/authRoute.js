const authController = require('../controllers/authController');
const { check } = require('express-validator');
const { Router } = require('express');
const authRoute = Router();

//GET REQUESTS
//Register page route
authRoute.get('/api/auth/register', authController.registerGET);

//Login page route
authRoute.get('/api/auth/login', authController.loginGET);

//Logout route 
authRoute.get('/api/auth/logout', authController.logoutGET);

//POST REQUESTS
//Route to register a new user
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
        check('gender')
            .isIn(['male', 'female', 'other'])
            .withMessage('Gender must be a male,female or other')
        ,
        check('password')
            .exists()
            .withMessage('Password is required')
            .matches('^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$')
            .withMessage('Password must contain at least: 3 lowercase, 2 uppercase letters,2 numbers and 1 special characters')
        ,
        check('role')
            .isIn(['buyer', 'seller'])
            .withMessage('User must be either be a buyer or a seller')

    ], authController.registerPOST);

//Route for a registered user to login 
authRoute.post('/api/auth/login',
    [
        check('email')
            .isEmail()
            .withMessage('Input must be a valid email address')
            .normalizeEmail()
    ]
    , authController.loginPOST);

//DELETE REQUESTS
//Route for user to delete account
authRoute.delete('/api/auth/delete', authController.deleteAccountDELETE);

//EXPORTS
module.exports = authRoute; 
