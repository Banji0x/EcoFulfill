const errHandler = (err) => {
    let error;

    //duplicate email addresses during registration 
    if (err.code === 11000) {
        error = "User already exists, please input a new email address."
        return error;
    }
    //invalid query parameters
    if (err.message.includes("Cast to ObjectId failed for value")) {
        error = "Invalid query parameter provided"
        return error;
    }
    //jsonwebtoken verification error
    if (err.message.includes('invalid signature')) {
        error = err.message;
        return error;
    }

    switch (err.message) {
        //User model error messages
        case 'Email has not been registered.':
            error = err.message
            break;
        case 'Password entered is incorrect.':
            error = err.message
            break;
        case `User isn't logged in.`:
            error = err.message
        case `Account not found.`:
            error = err.message
        //Catalog model error messages 
        case 'No seller was found.':
            error = err.message
            break;
        case `Seller doesn't have a catalog.`:
            error = err.message
            break;
        case `Item not in seller catalog.`:
            error = err.message
            break;
        case `No catalog was found.`:
            error = err.message
            break;
        //Cart model error messages
        case `Buyer doesn't have a cart.`:
            error = err.message
            break;
        case `Item not in buyer's cart.`:
            error = err.message
            break;
        case `Seller doesn't have up to the required quantity.`:
            error = err.message
            break;
        case 'Invalid Id provided.':
            error = err.message
        //order model error messages
        case `Buyer doesn't have any order.`:
            error = err.message
            break;
        case `Buyer doesn't have any order with seller.`:
            error = err.message
        case `Seller doesn't have any order.`:
            error = err.message
            break;
        case `Item not in buyer's orders`:
            error = err.message
            break;
        case `Product not in orders.`:
            error = err.message
            break;
        case `Input must be either a product name or Id.`:
            error = err.message
            break;
        case `Input must contain either a productName or productId.`:
            error = err.message
            break;
    }

    // validationResult from express-validator
    if (err.errors !== undefined) {
        error = err
        return error;
    };

    return error;
};

module.exports = errHandler;