const { Router } = require('express');
const buyerController = require('../controllers/buyerController');
const { BUYERONLY } = require('../middleware/routeProtection');
const { check } = require('express-validator');
const buyerRoute = Router();

//GET REQUESTS
buyerRoute.get('/api/buyer', BUYERONLY, buyerController.buyerRouteAuth);

buyerRoute.get('/api/buyer/list-of-sellers', BUYERONLY, buyerController.allSellersGET);

buyerRoute.get('/api/buyer/allCatalogs', BUYERONLY, buyerController.allCatalogsGET);

buyerRoute.get('/api/buyer/seller-catalog/:sellerID', BUYERONLY, buyerController.sellerCatalogGET);

buyerRoute.get('/api/buyer/cart', BUYERONLY, buyerController.cartGET);

buyerRoute.get('/api/buyer/orders', BUYERONLY, buyerController.ordersGET);

//POST REQUESTS
//name,quantity
buyerRoute.post('/api/buyer/create-cart/:sellerID', BUYERONLY, [
    check('name')
        .exists()
        .withMessage('Product requires a name field')
        .isString()
        .withMessage('Product name must be a string')
        .toLowerCase()
        .trim(),
    check('quantity')
        .exists()
        .withMessage('Product requires a quantity field')
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a greater than zero')
], buyerController.createCartPOST);

//create Orders using Cart
buyerRoute.post('/api/buyer/push-orders', BUYERONLY, buyerController.createOrderUsingCart);

//	Send a list of items to create an order for seller with id = seller_id
buyerRoute.post('/api/buyer/create-order/:sellerID', BUYERONLY, [
    check('name')
        .exists()
        .withMessage('Product requires a name field')
        .isString()
        .withMessage('Product name must be a string')
        .toLowerCase()
        .trim(),
    check('quantity')
        .default(1)
        .exists()
        .withMessage('Product requires a quantity field')
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a greater than zero')
], buyerController.createOrderPOST);

//PUT REQUESTS
//update Cart
//name,quantity
buyerRoute.put('/api/buyer/update-cart', BUYERONLY, [
    check('name')
        .exists()
        .withMessage('Product requires a name field')
        .isString()
        .withMessage('Product name must be a string')
        .toLowerCase()
        .trim(),
    check('quantity')
        .exists()
        .withMessage('Product requires a quantity field')
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a greater than zero')
], buyerController.updateCartPUT);

//DELETE REQUESTS
buyerRoute.delete('/api/buyer/cart/:productId', BUYERONLY, buyerController.productInCartDELETE);

buyerRoute.delete('/api/buyer/delete-cart', BUYERONLY, buyerController.cartDELETE);

buyerRoute.delete('/api/buyer/cancel-order', BUYERONLY, buyerController.orderDELETE)

//EXPORTS
module.exports = buyerRoute; 