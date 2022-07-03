const User = require('../models/User');
const errHandler = require('../controllers/errorHandler');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//GET REQUESTS 
module.exports.registerGET = (req, res) => {
  res.status(400).send("Unauthorized User");
};

module.exports.loginGET = (req, res) => {
  res.status(400).send("Unauthorized User");
};

module.exports.logoutGET = async (req, res) => {
  if (req.cookies.AUTHTOKEN) {
    res.clearCookie('AUTHTOKEN')
    res.status(200).json("User has been successfully logged out")
  } else {
    res.status(400).json("User is not logged in")
  }
};

//POST REQUESTS 
module.exports.registerPOST = async (req, res) => {
  // validateInput(req, res, next);
  const { name, email, password, role } = req.body;
  try {
    validationResult(req).throw();
    const user = await User.create({ name, email, password, role });
    const token = await user.generateJwtToken();
    res.cookie("AUTHTOKEN", token, { httponly: true, expiresIn: process.env.COOKIEEXPIRYDATE });
    res.status(201).json(`${user.name} has been registered as a ${user.role} successfully`);
  }
  catch (err) {
    const error = errHandler(err)
    res.status(400).send(error);
  }
};

module.exports.loginPOST = async (req, res) => {
  const { email, password } = req.body;
  try {
    validationResult(req).throw();
    const user = await User.login(email, password);
    const token = await user.generateJwtToken();
    res.cookie("AUTHTOKEN", token, { httponly: true, maxAge: new Date(Date.now()) });
    res.status(201).json(`${user.name} has been logged in as a ${user.role}`);
  }
  catch (err) {
    console.log(err.message);
    const error = errHandler(err);
    res.status(404).json(error);
  }
};

//DELETE REQUESTS
module.exports.deleteAccountDELETE = async (req, res) => {
  try {
    if (!req.cookies.AUTHTOKEN) { throw new Error(`User isn't logged in.`) };
    const userID = jwt.verify(req.cookies.AUTHTOKEN, process.env.JWTBUYERSECRET || process.env.JWTSELLERSECRET);
    await User.deleteAccount(userID._id);
    res.status(200).send("Account deleted.");
  } catch (err) {
    console.log(err.message);
    const error = errHandler(err)
    res.status(400).send(error)
  }
};