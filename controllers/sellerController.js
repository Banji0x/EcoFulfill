const Order = require('../models/Order');
const Catalog = require('../models/Catalog');
const errorHandler = require('../controllers/errorHandler');
const { validationResult } = require('express-validator');

module.exports.sellerRouteAuth = (req, res) => {
    res.status(200).json(`Seller ${req.userID} verified`);
};

//GET REQUESTS
//Controller to retrieve all orders a seller has received
module.exports.ordersListGET = async (req, res) => {
    //gets the list of orders a seller has receieved 
    const sellerId = req.userID;
    try {
        const orders = await Order.getOrdersSeller(sellerId);
        res.status(200).json(orders);
    } catch (err) {
        const error = errorHandler(err);
        res.status(400).json(error);
    }
};

//Controller for a seller to get his/her catalog
module.exports.sellerCatalogGET = async (req, res) => {
    const sellerId = req.userID;
    try {
        const catalog = await Catalog.getCatalogById(sellerId);
        res.status(200).send(catalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(404).send(error)
    }
};

//POST REQUESTS
//Controller to add products to a new/existing catalog
module.exports.createCatalogPOST = async (req, res) => {
    //pushes products to existing/new catalog
    const sellerId = req.userID;
    const { name, price, quantity, category, description } = req.body;
    try {
        validationResult(req).throw();
        const catalog = await Catalog.createCatalog(sellerId, name, price, quantity, category, description);
        res.status(201).json(catalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(500).json(error);
    }
};

//PATCH REQUESTS
//Controller to update products in a catalog
module.exports.updateCatalogPATCH = async function (req, res) {
    //updates products in catalog
    const sellerId = req.userID;
    const { productId } = req.params;
    const { name, price, quantity, category, description } = req.body;
    try {
        validationResult(req).throw();
        const updatedCatalog = await Catalog.updateCatalog(sellerId, productId, name, price, quantity, category, description);
        res.status(200).json(updatedCatalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
    }
};

//DELETE REQUESTS
//Controller to delete products in a catalog
module.exports.deleteProductFromCatalog = async function (req, res) {
    try {
        validationResult(req).throw();
        const sellerId = req.userID;
        const { productId } = req.params;
        await Catalog.deleteProduct(sellerId, productId)
        res.status(200).send("Product deleted successfully")
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
        console.error(err.message);
    }

};

//Controller for seller to delete catalog
module.exports.CatalogDELETE = async function (req, res) {
    try {
        const sellerId = req.userID;
        await Catalog.deleteCatalog(sellerId);
        res.status(200).send('Catalog deleted successfully')
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json(error);
    }
};

