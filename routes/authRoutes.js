const {Router} = require('express');
const authRouter = Router();
const authController = require('../controllers/authControllers');
//get request to get the register page.
authRouter.get('/api/auth/register',authController.registerGET);
//get request to get the login page.
authRouter.get('/api/auth/login',authController.loginGET);
//post request to send data from the register page to the server.
authRouter.post('/api/auth/register',authController.registerPOST);
//post request to send data from the login page to the server.
authRouter.post('/api/auth/login',authController.loginPOST);

module.exports = authRouter; 