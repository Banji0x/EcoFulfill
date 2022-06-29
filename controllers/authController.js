const User = require('../models/User');
const validateInput = require('../middleware/validateInput');
const errHandler = require('../controllers/errorHandler');

module.exports.registerGET = (req, res) => {
  res.status(400).send("Kindly switch request to POST to register");
};

module.exports.loginGET = (req, res) => {
  res.status(400).send("Kindly switch request to POST to login");
};

module.exports.registerPOST = async (req, res, next) => {
  validateInput(req, res, next);
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    console.log(user);
    const token = await user.generateJwtToken();
    res.cookie("AUTHTOKEN", token, { httponly: true, expiresIn: process.env.COOKIEEXPIRYDATE });
    res.status(201).json(`${user.name} has been registered as a ${user.role} successfully`);
  }
  catch (err) {
    console.log(err);
    const error = errHandler(err)
    res.status(400).json(error);
  }
};
module.exports.loginPOST = async (req, res, next) => {
  validateInput(req, res, next);
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = await user.generateJwtToken();
    res.cookie("AUTHTOKEN", token, { httponly: true, maxAge: new Date(Date.now()) });
    res.status(201).json(`${user.name} has been logged in successfully as a ${user.role} successfully`);
  }
  catch (err) {
    const error = errHandler(err);
    res.status(404).json(error);
    console.error(error);
  }
};

module.exports.logoutGET = async (req, res) => {
  if (req.cookies.AUTHTOKEN) {
    res.clearCookie('AUTHTOKEN')
    res.status(200).json("User has been successfully logged out")
  } else {
    res.status(400).json("User is not logged in")
  }
};
