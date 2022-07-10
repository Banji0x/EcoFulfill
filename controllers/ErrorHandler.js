const errHandler = (err) => {

    let error;
    // Code for duplicates while registering 
    //User model error message
    if (err.code === 11000) {
        error = "User already exists, please input a new email address."
        return error;
    }

    // if (err.message.includes("Cast to ObjectId failed for value")) {
    //     error = "Invalid Id provided"
    // }

    switch (err.message) {
        //User model error messages
        case 'Email has not been registered.':
            error = err.message
            break;
        case 'Password entered is incorrect.':
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
        case 'Seller not found.':
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
        case `Buyer doesn't have any order with seller.`:
            error = err.message
        //order model error messages
        case `Buyer doesn't have any order.`:
            error = err.message
            break;
        case `Seller doesn't have any order.`:
            error = err.message
            break;
        case `Item not in buyer's orders`:
            error = err.message
            break;
        case `Buyer doesn't have any order.`:
            error = err.message
            break;
    }

    //Returning the validationResult from the express-validator package
    if (err.errors !== undefined) {
        error = err
        return error;
    };

    return error;
};

module.exports = errHandler;