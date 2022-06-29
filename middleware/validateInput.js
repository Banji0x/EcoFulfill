const { validationResult } = require('express-validator');

function validateInput(req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        return res.status(422).json({ errors: err.array() });
    }
    next();
}
module.exports = validateInput;