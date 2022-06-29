const User = require('../models/User');
const Order = require('../models/Order');
const Catalog = require('../models/Catalog');
const Cart = require('../models/Cart');
const validateInput = require('../middleware/validateInput');
const errHandler = require('../controllers/errorHandler');

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
    try {
        const { sellerID } = req.params;
        const sellerCatalog = await Catalog.getcatalogByID(sellerID);
        res.status(201).json(sellerCatalog);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
        console.error(error);
    }
};

module.exports.cartGET = async (req, res) => {
    try {
        const buyerID = req.user_id;
        const cart = await Cart.retrieveCart(buyerID);
        res.status(201).send(cart);
    } catch (err) {
        const error = errHandler(err);
        res.status(404).json(error);
        console.error(err);
    }
}

module.exports.ordersGET = async (req, res) => {
    const buyerID = req.userID;
    try {
        const orders = await Order.getOrders(buyerID);
        res.status(201).json(orders);
    } catch (err) {
        console.log(err.message);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//POST REQUESTS
module.exports.createCartPOST = async (req, res, next) => {
    validateInput(req, res, next);
    try {
        const buyerID = req.userID;
        const { sellerID } = req.params;
        const { name, quantity } = req.body
        const cart = await Cart.cartCreation(buyerID, sellerID, name, quantity);
        res.status(201).json(cart);
    } catch (err) {
        console.log(err.message);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

module.exports.createOrderPOST = async (req, res) => {
    validateInput(req, res, next);
    try {
        const buyerID = req.userID;
        const { sellerID } = req.params;
        const { name, quantity } = req.body
        const order = await Order.createOrder(buyerID, sellerID, name, quantity);
        res.status(201).json(order);
    } catch (err) {
        console.log(err.message);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

//PUT REQUESTS
module.exports.updateCartPUT = async (req, res) => {
    const buyerID = req.userID
    const { name, quantity } = req.body;
    try {
        const updatedCart = Cart.updateCart(buyerID, name, quantity);
        res.status(200).json(updatedCart);
    } catch (err) {
        console.log(err.message);
        const error = errHandler(err);
        res.status(404).json(error);
    }
};

// DELETE REQUESTS
module.exports.productInCartDELETE = async (req, res) => {
    try {
        const buyerID = req.userID;
        const productID = req.params.productId;
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
        res.status(500).send("Internal Server Error");
    }
};

module.exports.orderDELETE = async (req, res) => {
    const buyerID = req.userID;
    try {
        await deleteOrder(buyerID);
        res.status(200).send('Order deleted successfully');
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};