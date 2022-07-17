const User = require('../models/User');
const Order = require('../models/Order');
const Catalog = require('../models/Catalog');
const Cart = require('../models/Cart');
const errHandler = require('../controllers/errorHandler');
const { validationResult } = require('express-validator');

//GET REQUESTS 
//controller to get all sellers 
module.exports.allSellersGET = async (req, res) => {
    try {
        const sellers = await User.allSellers();
        res.status(201).json({ sellers });
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};
 
//Controller for buyer to get all available catalogs 
module.exports.allCatalogsGET = async (req, res) => {
    //get the catalog of all sellers
    try {
        const catalogs = await Catalog.allCatalogs();
        res.status(201).json(catalogs);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//Controller for buyer to get a seller's catalog
module.exports.sellerCatalogGET = async (req, res) => {
    //get the catalog of a seller using the seller Id
    const { sellerId } = req.params;
    try {
        const sellerCatalog = await Catalog.getCatalogById(sellerId);
        res.status(201).json(sellerCatalog);
    } catch (err) {
        const error = errHandler(err);
        res.status(400).json({ error });
    }
};

//Controller for buyer to get his/her cart
module.exports.cartGET = async (req, res) => {
    const { userId } = req.locals;
    try {
        const cart = await Cart.retrieveCart(userId);
        res.status(201).send(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//Controller for buyer to get list of products his/her ordered
module.exports.ordersGET = async (req, res) => {
    const { userId } = req.locals;
    try {
        const orders = await Order.getOrders(userId);
        res.status(200).json(orders);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//POST REQUESTS
//Controller for buyer to add products to an existing/new cart
module.exports.createCartPOST = async (req, res) => {
    const { userId } = req.locals;
    const { sellerId } = req.params;
    const { productId, quantity } = req.body;
    try {
        validationResult(req).throw();
        const cart = await Cart.cartCreation(userId, sellerId, productId, quantity);
        res.status(201).json(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//Controller for buyer to place order of products already in cart
module.exports.createOrderUsingCart = async function (req, res) {
    const { userId } = req.locals;
    try {
        validationResult(req).throw();
        await Cart.createOrderUsingCart(userId);
        res.status(201).send(`Order created successfully.`);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//Controller for buyer to order products using either a name or an Id without having to add to it cart.
module.exports.createOrderPOST = async (req, res) => {
    const { userId } = req.locals;
    const { sellerId } = req.params;
    const { productId, productName, quantity } = req.body;
    let identifier;
    if (productId) identifier = productId;
    if (productName) identifier = productName;
    try {
        validationResult(req).throw();
        if (productId && productName) throw new Error('Input must be either a product name or Id.');
        if (!productId && !productName) throw new Error('Input must contain either a product name or Id.');
        await Order.createOrder(userId, sellerId, identifier, quantity);
        res.status(201).send(`Order created successfully.`);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//PATCH REQUESTS
//Controller for buyer to update products in cart
module.exports.updateCartPATCH = async (req, res) => {
    const { userId } = req.locals;
    const { productId, quantity } = req.body;
    try {
        validationResult(req).throw();
        const updatedCart = await Cart.updateCart(userId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//DELETE REQUESTS
//Controller for buyer to delete product in cart.
module.exports.productInCartDELETE = async (req, res) => {
    const { userId } = req.locals;
    const { productId } = req.params;
    try {
        const cart = await Cart.deleteProductInCart(userId, productId);
        res.status(201).json(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json({ error });
    }
};

//Controller for buyer to delete cart
module.exports.cartDELETE = async (req, res) => {
    const { userId } = req.locals;
    try {
        await Cart.deleteCart(userId);
        res.status(200).send('Cart deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).json({ error });
    }
};

//Controller for buyer to cancel an order placed with a seller
module.exports.orderedProductDELETE = async (req, res) => {
    const { userId } = req.locals;
    const { sellerId } = req.params;
    const { productId } = req.params
    try {
        await Order.deleteOrderedProduct(userId, sellerId, productId);
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).json({ error });
    }
};

//Controller for buyer to cancel all orders placed with a seller
module.exports.orderDELETE = async (req, res) => {
    const { userId } = req.locals;
    const { sellerId } = req.params;
    try {
        await Order.deleteOrders(userId, sellerId);
        res.status(200).send('Orders deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).json({ error });
    }
};

//Controller for buyer to cancel all orders placed
module.exports.allOrdersDELETE = async (req, res) => {
    const { userId } = req.locals;
    try {
        await Order.deleteAllOrders(userId);
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        const error = errHandler(err);
        res.status(500).json({ error });
    }
};


