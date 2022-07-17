const { Router } = require('express');
const buyerController = require('../controllers/buyerController');
const { buyerOnly } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const buyerRoute = Router();

//GET REQUESTS
//Route for the buyer to get all sellers
buyerRoute.get('/api/buyer/list-of-sellers', buyerOnly, buyerController.allSellersGET);

//Route for the buyer to get all catalogs
buyerRoute.get('/api/buyer/catalogs', buyerOnly, buyerController.allCatalogsGET);

//Route to get the seller's catalog using the seller's id
buyerRoute.get('/api/buyer/seller-catalog/:sellerId', buyerOnly, buyerController.sellerCatalogGET);

//Route for the buyer to retrieve existing cart document
buyerRoute.get('/api/buyer/cart', buyerOnly, buyerController.cartGET);

//Route to get the buyer to retrieve his/her orders
buyerRoute.get('/api/buyer/orders', buyerOnly, buyerController.ordersGET);

//POST REQUESTS
//Route for the buyer to add a product to cart using the product id 
buyerRoute.post('/api/buyer/create-cart/:sellerId', buyerOnly, [
    check('productId')
        .exists()
        .withMessage('productId is required')
        .isString()
        .withMessage('productId must be a string'),
    check('quantity')
        .exists()
        .withMessage('Product requires a quantity field')
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a greater than zero')
], buyerController.createCartPOST);

//Route for the buyer to place order of products in cart
buyerRoute.post('/api/buyer/push-orders', buyerOnly, buyerController.createOrderUsingCart);

//Route for the buyer to create a new order with either the product name or product id
buyerRoute.post('/api/buyer/create-order/:sellerId', buyerOnly, [
    check('productId')
        .optional()
        .isString()
        .withMessage('productId must be a string')
        .isLength({ min: 24 })
        .withMessage('input must be a product Id')
    ,
    check('productName')
        .optional()
        .isString()
        .withMessage('productName must be a string')
        .isLength({ max: 10 })
        .withMessage('input must be a product name')
    ,
    check('quantity')
        .default(1)
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a greater than zero')
], buyerController.createOrderPOST);

//PATCH REQUESTS
//Route for the buyer to update products already added to th cart document
buyerRoute.patch('/api/buyer/cart/update', buyerOnly, [
    check('productId')
        .exists()
        .withMessage('productId is required')
        .isString()
        .withMessage('productId must be a string')
    ,
    check('quantity')
        .exists()
        .withMessage('Product requires a quantity field')
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a greater than zero')
], buyerController.updateCartPATCH);

//DELETE REQUESTS
//Route for the buyer to delete a product already added to cart
buyerRoute.delete('/api/buyer/cart/:productId', buyerOnly, buyerController.productInCartDELETE);

//Route for the buyer to delete an existing cart
buyerRoute.delete('/api/buyer/delete-cart', buyerOnly, buyerController.cartDELETE);

//Route for the buyer to cancel a particular product ordered from a seller using the product id and the seller id 
buyerRoute.delete('/api/buyer/orders/:sellerId/:productId', buyerOnly, buyerController.orderedProductDELETE);

//Route for the buyer to cancel all ordered products from a seller
buyerRoute.delete('/api/buyer/orders/:sellerId', buyerOnly, buyerController.orderDELETE);

// Route for the buyer to cancel all orders 
buyerRoute.delete('/api/buyer/cancel-orders', buyerOnly, buyerController.allOrdersDELETE);

//EXPORTS
module.exports = buyerRoute; 