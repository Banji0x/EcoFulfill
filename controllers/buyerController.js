const User = require('../models/User');
const Order = require('../models/Order');
const Catalog = require('../models/Catalog');
const Cart = require('../models/Cart');
const errHandler = require('../controllers/errorHandler');
const { validationResult } = require('express-validator');

module.exports.buyerRouteAuth = (req, res) => {
    res.status(200).json(`Buyer: ${req.userID} verified`);
};

//GET REQUESTS 
module.exports.allSellersGET = async (req, res) => {
    //gets all sellers in a list including their name and _id
    try {
        const sellers = await User.allSellers();
        res.status(201).json({ sellers });
    } catch (err) {
        res.status(500).send("Internal Server Error");
        console.error(err.message);
    }
};

module.exports.allCatalogsGET = async (req, res) => {
    //get the catalog of all sellers
    try {
        const catalogs = await Catalog.allCatalogs();
        res.status(201).json(catalogs);
    } catch (err) {
        res.status(500).send("Internal Server Error");
        console.error(err.message);
    }
};

module.exports.sellerCatalogGET = async (req, res) => {
    //get the catalog of a seller using the seller ID
    const { sellerID } = req.params;
    try {
        const sellerCatalog = await Catalog.getSellerCatalogById(sellerID);
        res.status(201).json(sellerCatalog);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
        console.error(error);
    }
};

module.exports.cartGET = async (req, res) => {
    const buyerID = req.userID;

    try {
        const cart = await Cart.retrieveCart(buyerID);
        res.status(201).send(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
}

module.exports.ordersGET = async (req, res) => {
    const buyerID = req.userID;
    try {
        const orders = await Order.getOrders(buyerID);
        res.status(201).json(orders);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//POST REQUESTS
module.exports.createCartPOST = async (req, res) => {
    const buyerID = req.userID;
    const { sellerID } = req.params;
    const { name, quantity } = req.body
    try {
        validationResult(req).throw();
        const cart = await Cart.cartCreation(buyerID, sellerID, name, quantity);
        res.status(201).json(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

module.exports.createOrderUsingCart = async function (req, res) {
    const buyerID = req.userID;
    try {
        validationResult(req).throw();
        const order = await Cart.pushCart(buyerID);
        res.status(201).json(order);
    } catch (err) {
        console.log(err.message);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//send products directly to the seller without adding to cart.
module.exports.createOrderPOST = async (req, res) => {
    const buyerID = req.userID;
    const sellerID = req.params.sellerID
    const { name, quantity } = req.body
    try {
        validationResult(req).throw();
        const order = await Order.createOrder(buyerID, sellerID, name, quantity);
        res.status(201).send("Order created successfully");
    } catch (err) {
        console.log(err);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//PUT REQUESTS
module.exports.updateCartPUT = async (req, res) => {
    const buyerID = req.userID
    const { name, quantity } = req.body;
    try {
        validationResult(req).throw();
        const updatedCart = await Cart.updateCart(buyerID, name, quantity);
        res.status(200).json(updatedCart);
    } catch (err) {
        console.log(err);
        const error = errHandler(err);
        res.status(404).json(error);
    }

};

// DELETE REQUESTS
module.exports.productInCartDELETE = async (req, res) => {
    const buyerID = req.userID;
    const productID = req.params.productId;
    try {
        const cart = await Cart.deleteProductInCart(buyerID, productID);
        res.status(201).json(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};


module.exports.cartDELETE = async (req, res) => {
    const buyerID = req.userID;
    try {
        await Cart.deleteCart(buyerID);
        res.status(200).send('Cart deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).json(error);
    }
};

module.exports.orderDELETE = async (req, res) => {
    const buyerID = req.userID;
    try {
        await Order.deleteOrder(buyerID);
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
};


