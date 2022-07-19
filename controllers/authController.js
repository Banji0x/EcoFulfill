const User = require('../models/User');
const errHandler = require('../controllers/errorHandler');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//GET REQUESTS 
module.exports.registerGET = (req, res) => {
  // res.render('')
  res.status(200).json({ message: 'Registration page goes here' })
};

module.exports.loginGET = (req, res) => {
  // res.render('')
  res.status(200).json({ message: 'Login page goes here' })
};

//Controller for user to logout
module.exports.logoutGET = async (req, res) => {
  try {
    const { AUTHTOKEN } = req.cookies;
    if (!AUTHTOKEN) throw new Error();
    //c
    res.clearCookie('AUTHTOKEN');
    // res.redirect('/api/homepage');
    res.json({ message: 'User logged out' })
  } catch (err) {
    res.status(400).json({ error: 'User not logged in' });
  }
};

//POST REQUESTS 
//Controller for a new user to register
module.exports.registerPOST = async (req, res) => {
  // validateInput(req, res, next);
  const { name, email, gender, password, role, catalog } = req.body;
  try {
    validationResult(req).throw();
    const user = await User.create({ name, email, gender, password, role, catalog });
    const token = await user.generateJwtToken();
    res.cookie("AUTHTOKEN", token, { httponly: true, expiresIn: process.env.COOKIEEXPIRYDATE });
    res.status(201).json({ message: `${user.name} has been registered as a ${user.role} successfully` });
  }
  catch (err) {
    const error = errHandler(err);
    res.status(400).json({ error });
  }
};

//Controller for user to login
module.exports.loginPOST = async (req, res) => {
  const { email, password } = req.body;
  try {
    validationResult(req).throw();
    const user = await User.login(email, password);
    const token = await user.generateJwtToken();
    res.cookie("AUTHTOKEN", token, { httponly: true, expiresIn: process.env.COOKIEEXPIRYDATE });
    res.status(201).json({ message: `${user.name} has been logged in as a ${user.role}` });
  }
  catch (err) {
    const error = errHandler(err);
    res.status(404).json({ error });
  }
};

//DELETE REQUESTS
//Controller for a user to delete account
module.exports.deleteAccountDELETE = async (req, res) => {
  try {
    const { AUTHTOKEN } = req.cookies;
    if (!AUTHTOKEN) throw new Error(`User isn't logged in.`);
    const verified = jwt.verify(AUTHTOKEN, process.env.JWTSECRET);
    await User.deleteAccount(verified._id);
    res.clearCookie('AUTHTOKEN');
    //redirect user to homepage
    //res.redirect('/api/homepage')
    res.status(200).json({ message: 'Account deleted.' });
  } catch (err) {
    const error = errHandler(err);
    res.status(400).json({ error });
  }
};