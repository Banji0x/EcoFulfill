const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Unauthorized users will receive an error as a response
//Buyeronly route protection
const buyerOnly = async (req, res, next) => {
    try {
        const { AUTHTOKEN } = req.cookies;
        if (!AUTHTOKEN) throw new Error();
        jwt.verify(AUTHTOKEN, process.env.JWTSECRET,
            (err, decodedToken) => {
                if (err || decodedToken.role !== 'buyer') throw new Error();
                req.locals = { userId: decodedToken._id, role: decodedToken.role };
                next();
            });
    } catch (err) {
        res.status(403).json({ error: "User is not authorized" });
    }
};

//Selleronly route protection
const sellerOnly = async (req, res, next) => {
    try {
        const { AUTHTOKEN } = req.cookies;
        if (!AUTHTOKEN) throw new Error();
        jwt.verify(AUTHTOKEN, process.env.JWTSECRET,
            (err, decodedToken) => {
                if (err || decodedToken.role !== 'seller') throw new Error();
                req.locals = { userId: decodedToken._id, role: decodedToken.role };
                next();
            });
    } catch (err) {
        res.status(403).json({ error: "User is not authorized" });
    };
};

//sends the user details to frontend for conditional rendering 
const currentUser = async (req, res, next) => {
    const { AUTHTOKEN } = req.cookies;
    if (!AUTHTOKEN) {
        res.locals.user = null;
    } else {
        jwt.verify(AUTHTOKEN, process.env.JWTSECRET, async (err, decodedToken) => {
            if (err) res.locals = null;
            if (decodedToken) {
                let user = await User.findById(decodedToken._id);
                if (user) {
                    res.locals = { email: user.email, role: user.role };
                } else {
                    res.locals = null;
                };
            }
        });
    };
    // console.log(res.locals.email,res.locals.role);
    next();
};

// Exports 
module.exports = { buyerOnly, sellerOnly, currentUser }; 