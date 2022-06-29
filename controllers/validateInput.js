const { validationResult } = require('express-validator');

function validateInput(req, res) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        return res.status(422).json({ errors: err.array() });
    }
}
module.exports = validateInput;