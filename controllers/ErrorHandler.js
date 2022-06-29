const errHandler = (err) => {

    let error = '';
    // Code for duplicates while registering 
    //User model error message
    if (err.code === 11000) {
        error = "User already exists, please input a new email address."
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
        case 'Password entered is incorrect.':
            error = err.message
            break;
        //Catalog model error messages 
        case 'Seller not found.':
            error = err.message
            break;
        case `Seller doesn't have a catalog.`:
            error = err.message
            break;
        case `Catalog not found.`:
            error = err.message
            break;
        case `Item not in seller catalog.`:
            error = err.message
            break;
        //Cart model error messages
        case `Buyer doesn't have a cart.`:
            error = err.message
            break;
        case 'Item is not in buyer cart.':
            error = err.message
            break;
        case `Buyer doesn't have a cart.`:
            error = err.message
            break;
        case 'Seller not found':
            error = err.message

        //order model error messages
        case 'Seller not found':
            error = err.message
            break;
        case 'Seller not found':
            error = err.message
            break;
        case 'Seller not found':
            error = err.message
            break;
    }
    return error;
};

module.exports = errHandler;