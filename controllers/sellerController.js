const User = require('../models/User');
const Catalog = require('../models/Catalog');
const validateInput = require('../middleware/validateInput');
const errorHandler = require('../controllers/errorHandler')

module.exports.sellerRouteAuth = (req, res) => {
    res.status(200).json(`Seller ${req.user_id} verified`);
};

//GET REQUESTS 
module.exports.ordersListGET = async (req, res) => {
    //gets the list of orders a seller has && the buyerID
    try {
        const buyerID = req.userID;
        const orders = await User.getOrders(buyerID);
        console.log(orders)
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

//POST REQUESTS
module.exports.createCatalogPOST = async (req, res, next) => {
    //pushes products to existing/new catalog
    validateInput(req, res, next);
    const sellerID = req.userID;
    const { name, price, quantity, description } = req.body;
    try {
        const catalog = await Catalog.createCatalog(sellerID, name, price, quantity, description);
        res.status(201).json(catalog);
    } catch (err) {
        res.status(500).json('Internal server error');
        console.error(err.message);
    }
};

//PUT REQUESTS
module.exports.updateCatalogPUT = async function (req, res, next) {
    //updates products in catalog
    validateInput(req, res, next);
    const sellerID = req.userID;
    const { name, price, quantity, description } = req.body;
    try {
        const updatedCatalog = await Catalog.updateCatalog(sellerID, name, price, quantity, description);
        res.status(200).json(updatedCatalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
        console.error(err.message);
    }

};

//DELETE REQUESTS
module.exports.deleteProductFromCatalog = async function (req, res, next) {
    try {
        const sellerID = req.userID;
        const { name } = req.params;
        await Catalog.deleteProduct(sellerID, name)
        res.status(200).send("Product deleted successfully")
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
        console.error(err.message);
    }

}

module.exports.deleteCatalogDELETE = async function (req, res, next) {
    try {
        const sellerID = req.userID;
        await Catalog.deleteCatalog(sellerID);
        res.status(200).send('Catalog deleted successfully')
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
        console.error(err.message);
    }

}

