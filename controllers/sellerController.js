const Order = require('../models/Order');
const Catalog = require('../models/Catalog');
const errorHandler = require('../controllers/errorHandler');
const { validationResult } = require('express-validator');

//GET REQUESTS
//Controller for seller to retrieve the list of orders he/she  has received
module.exports.ordersListGET = async (req, res) => {
    const { userId, role } = req.locals;
    try {
        const orders = await Order.getOrders(userId, role);
        res.status(200).json({ orders });
    } catch (err) {
        console.error(err);
        const error = errorHandler(err);
        res.status(400).json({ error });
    }
};

//Controller for a seller to get his/her catalog
module.exports.sellerCatalogGET = async (req, res) => {
    const { userId } = req.locals;
    try {
        const catalog = await Catalog.getCatalogById(userId);
        res.status(200).json({ catalog });
    } catch (err) {
        const error = errorHandler(err);
        res.status(404).json({ error });
    }
};

//POST REQUESTS
//Controller for a seller to add products to a new/existing catalog
module.exports.createCatalogPOST = async (req, res) => {
    //pushes products to existing/new catalog
    const { userId } = req.locals;
    const { name, price, quantity, category, description } = req.body;
    try {
        validationResult(req).throw();
        const catalog = await Catalog.createCatalog(userId, name, price, quantity, category, description);
        res.status(201).json(catalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(500).json({ error });
    }
};

//PATCH REQUESTS
//Controller to update products in a catalog
module.exports.updateCatalogPATCH = async function (req, res) {
    //updates products in catalog
    const { userId } = req.locals;
    const { productId } = req.params;
    const { name, price, quantity, category, description } = req.body;
    try {
        validationResult(req).throw();
        const updatedCatalog = await Catalog.updateCatalog(userId, productId, name, price, quantity, category, description);
        res.status(200).json(updatedCatalog);
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json({ error });
    }
};

//DELETE REQUESTS
//Controller to delete products in a catalog
module.exports.deleteProductFromCatalog = async function (req, res) {
    try {
        validationResult(req).throw();
        const { userId } = req.locals;
        const { productId } = req.params;
        const newCatalog = await Catalog.deleteProduct(userId, productId)
        res.status(200).json({ newCatalog })
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json({ error });
    }

};

//Controller for seller to delete catalog
module.exports.CatalogDELETE = async function (req, res) {
    try {
        const { userId } = req.locals;
        await Catalog.deleteCatalog(userId);
        res.status(200).json({ message: 'Catalog deleted successfully' })
    } catch (err) {
        const error = errorHandler(err);
        res.status(403).json({ error });
    }
};

