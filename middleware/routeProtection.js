const jwt = require('jsonwebtoken');

//Unauthorized user will automatically be redirected.
//Buyeronly route protection
const BUYERONLY = async (req, res, next) => {
    const encodedToken = req.cookies.AUTHTOKEN
    if (encodedToken) {
         jwt.verify(encodedToken, process.env.JWTBUYERSECRET, (err, decodedToken) => {
            if (err) {
                res.redirect('/api/auth/register');
            } else {
                req.userID = decodedToken._id;
                next();
            }
        })
    } else {
        res.redirect('/api/auth/register')
    }
};

//Selleronly route protection
const SELLERONLY = async (req, res, next) => {
    const encodedToken = req.cookies.AUTHTOKEN;
    if (encodedToken) {
         jwt.verify(encodedToken, process.env.JWTSELLERSECRET, (err, decodedToken) => {
            if (err) {
                res.redirect('/api/auth/login');
            } else {
                req.userID = decodedToken._id;
                next();
            }
        })
    } else {
        res.redirect('/api/auth/register')
    }
};


// Exports 
module.exports = { BUYERONLY, SELLERONLY };