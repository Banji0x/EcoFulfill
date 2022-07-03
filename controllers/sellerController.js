const User = require('../models/User');
const Catalog = require('../models/Catalog');
const errorHandler = require('../controllers/errorHandler');
const { validationResult } = require('express-validator');

module.exports.sellerRouteAuth = (req, res) => {
    res.status(200).json(`Seller ${req.userID} verified`);
};

//GET REQUESTS 
module.exports.ordersListGET = async (req, res) => {
    //gets the list of orders a seller has && the buyerID
    const sellerID = req.userID;
    try {
        const orders = await User.retrieveOrders(sellerID);
        console.log(orders)
        res.status(200).json(orders);
    } catch (err) {
        res.status(400).json(err.message);
    }
};

module.exports.sellerCatalogGET = async (req, res) => {
    const sellerID = req.userID;
    try {
        const catalog = await Catalog.getSellerCatalogById(sellerID);
        res.status(200).send(catalog);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
};

//POST REQUESTS
module.exports.createCatalogPOST = async (req, res) => {
    //pushes products to existing/new catalog
    const sellerID = req.userID;
    const { name, price, quantity, description } = req.body;
    try {
        validationResult(req).throw();
        const catalog = await Catalog.createCatalog(sellerID, name, price, quantity, description);
        res.status(201).json(catalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(500).json(error);
    }
};

//PUT REQUESTS
module.exports.updateCatalogPUT = async function (req, res) {
    //updates products in catalog
    const sellerID = req.userID;
    const { name, price, quantity, description } = req.body;
    try {
        validationResult(req).throw();
        const updatedCatalog = await Catalog.updateCatalog(sellerID, name, price, quantity, description);
        res.status(200).json(updatedCatalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
    }

};

//DELETE REQUESTS
module.exports.deleteProductFromCatalog = async function (req, res) {
    try {
        validationResult(req).throw();
        const sellerID = req.userID;
        const { productName } = req.params;
        await Catalog.deleteProduct(sellerID, productName.toLowerCase())
        res.status(200).send("Product deleted successfully")
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
        console.error(err.message);
    }

};

module.exports.deleteCatalogDELETE = async function (req, res) {
    try {
        const sellerID = req.userID;
        await Catalog.deleteCatalog(sellerID);
        res.status(200).send('Catalog deleted successfully')
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
        console.error(err.message);
    }

};

