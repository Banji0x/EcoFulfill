const {Router} = require('express');
const router = Router();
const authController = require('../controllers/authControllers');
//get request to get the register page.
router.get('/api/auth/register',authController.register_get);
//get request to get the login page.
router.get('/api/auth/login',authController.login_get);

//post request to send data from the register page to the server.
router.post('/api/auth/register',authController.register_post);
//post request to send data from the login page to the server.
router.post('/api/auth/login',authController.login_post);



module.exports = router; 