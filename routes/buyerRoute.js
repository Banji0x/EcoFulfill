const { Router } = require('express');
const buyerController = require('../controllers/buyerController');
const { BUYERONLY } = require('../middleware/routeProtection');
const { check } = require('express-validator');
const buyerRoute = Router();

//GET REQUESTS
buyerRoute.get('/api/buyer', BUYERONLY, buyerController.buyerRouteAuth);

buyerRoute.get('/api/buyer/list-of-sellers', BUYERONLY, buyerController.allSellersGET);

buyerRoute.get('/api/buyer/catalogs', BUYERONLY, buyerController.allCatalogsGET);

buyerRoute.get('/api/buyer/seller-catalog/:sellerId', BUYERONLY, buyerController.sellerCatalogGET);

buyerRoute.get('/api/buyer/cart', BUYERONLY, buyerController.cartGET);

buyerRoute.get('/api/buyer/orders', BUYERONLY, buyerController.ordersGET);

//POST REQUESTS
buyerRoute.post('/api/buyer/create-cart/:sellerId', BUYERONLY, [
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

//create Orders using Cart
buyerRoute.post('/api/buyer/push-orders', BUYERONLY, buyerController.createOrderUsingCart);

//Send a list of items to create an order for seller with id = seller_id
buyerRoute.post('/api/buyer/create-order/:sellerId', BUYERONLY, [
    check('productId')
        .if(check('productName').not().exists()) //if product name doesn't exist
        .not().isEmpty() //then the product Id is required
        .isString()
        .withMessage('Product id must be a string')
    ,
    check('productName')
        .if(check('productId').not().exists()) //if product Id doesn't exist
        .not().isEmpty() //then the product name is required
        .isString()
        .withMessage('Product name must be a string')
    ,
    check('quantity')
        .default(1)
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a greater than zero')
], buyerController.createOrderPOST);

//PATCH REQUESTS
//update Cart
buyerRoute.patch('/api/buyer/cart/update', BUYERONLY, [
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
//delete a product from cart
buyerRoute.delete('/api/buyer/cart/:productId', BUYERONLY, buyerController.productInCartDELETE);

//delete cart
buyerRoute.delete('/api/buyer/delete-cart', BUYERONLY, buyerController.cartDELETE);

// cancel a particular product ordered from a seller
buyerRoute.delete('/api/buyer/orders/:sellerId/:productId', BUYERONLY, buyerController.orderedProductDELETE);

//cancel all ordered Product from a seller
buyerRoute.delete('/api/buyer/orders/:sellerId', BUYERONLY, buyerController.orderDELETE);

//cancel all orders
buyerRoute.delete('/api/buyer/cancel-orders', BUYERONLY, buyerController.allOrdersDELETE);

//EXPORTS
module.exports = buyerRoute; 