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
//controller to get all sellers 
module.exports.allSellersGET = async (req, res) => {
    try {
        const sellers = await User.allSellers();
        res.status(201).json({ sellers });
    } catch (err) {
        const error = errHandler(err);
        res.status(404).send(error);
    }
};

//Controller to get all available catalogs 
module.exports.allCatalogsGET = async (req, res) => {
    //get the catalog of all sellers
    try {
        const catalogs = await Catalog.allCatalogs();
        res.status(201).json(catalogs);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).send(error);
    }
};

//Controller to get a seller atalog
module.exports.sellerCatalogGET = async (req, res) => {
    //get the catalog of a seller using the seller Id
    const { sellerId } = req.params;
    try {
        const sellerCatalog = await Catalog.getCatalogById(sellerId);
        res.status(201).json(sellerCatalog);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//Controller to get a buyer's cart
module.exports.cartGET = async (req, res) => {
    const buyerId = req.userID;
    try {
        const cart = await Cart.retrieveCart(buyerId);
        res.status(201).send(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//Controller to get buyer orders
module.exports.ordersGET = async (req, res) => {
    //gets the buyer list of orders 
    const buyerId = req.userID;
    try {
        const orders = await Order.getOrdersBuyer(buyerId);
        res.status(200).json(orders);
    } catch (err) {
        console.log(err.message)
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//POST REQUESTS
//Controller to add products to an existing/new cart
module.exports.createCartPOST = async (req, res) => {
    const buyerId = req.userID;
    const { sellerId } = req.params;
    const { productId, quantity } = req.body;
    try {
        validationResult(req).throw();
        const cart = await Cart.cartCreation(buyerId, sellerId, productId, quantity);
        res.status(201).json(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//Controller to order products already in cart
module.exports.createOrderUsingCart = async function (req, res) {
    const buyerId = req.userID;
    try {
        validationResult(req).throw();
        await Cart.createOrderUsingCart(buyerId);
        res.status(201).send(`Order created successfully.`);
    } catch (err) {
        console.log(err);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//Controller to order products using either a name or an Id without having to add to it cart.
module.exports.createOrderPOST = async (req, res) => {
    const buyerId = req.userID;
    const { sellerId } = req.params;
    const { productId, productName, quantity } = req.body;
    let identifier;
    if (productId) identifier = productId;
    if (productName) identifier = productName;
    try {
        validationResult(req).throw();
        await Order.createOrder(buyerId, sellerId, identifier, quantity);
        res.status(201).send(`Order created successfully.`);
    } catch (err) {
        console.log(err);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//PATCH REQUESTS
//Controller to update products in buyer's cart
module.exports.updateCartPATCH = async (req, res) => {
    const buyerId = req.userID
    const { productId, quantity } = req.body;
    try {
        validationResult(req).throw();
        const updatedCart = await Cart.updateCart(buyerId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//DELETE REQUESTS
//Controller to delete product in cart.
module.exports.productInCartDELETE = async (req, res) => {
    const buyerId = req.userID;
    const { productId } = req.params;
    try {
        const cart = await Cart.deleteProductInCart(buyerId, productId);
        res.status(201).json(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//Controller to delete a buyer's cart
module.exports.cartDELETE = async (req, res) => {
    const buyerId = req.userID;
    try {
        await Cart.deleteCart(buyerId);
        res.status(200).send('Cart deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).send(error);
    }
};

//Controller to cancel all orders made to a seller
module.exports.orderDELETE = async (req, res) => {
    const buyerId = req.userID;
    const { sellerId } = req.params;
    try {
        await Order.deleteOrder(buyerId, sellerId);
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        console.log(err.message);
        const error = errHandler(err);
        res.status(500).send(error);
    }
};

//Controller to cancel an order 
module.exports.orderedProductDELETE = async (req, res) => {
    const buyerId = req.userID;
    const { sellerId } = req.params;
    const { productId } = req.params
    try {
        await Order.deleteOrderedProduct(buyerId, sellerId, productId);
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).json(error);
    }
};

//Controller to cancel all orders 
module.exports.allOrdersDELETE = async (req, res) => {
    const buyerId = req.userID;
    try {
        await Order.deleteAllOrders(buyerId);
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).send(error);
    }
};


