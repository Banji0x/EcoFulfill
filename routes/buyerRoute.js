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
buyerRoute.post('/api/buyer/create-cart/:sellerID', BUYERONLY, buyerController.createCartPOST);

//	Send a list of items to create an order for seller with id = seller_id
buyerRoute.post('/api/buyer/create-order/:seller_id', BUYERONLY, buyerController.createOrderPOST);

//PUT REQUESTS
//update Cart
//name,quantity
buyerRoute.put('/api/buyer/update-cart', BUYERONLY, buyerController.updateCartPUT);

//update Order 
buyerRoute.put('/api/buyer/update-order/:seller_id', BUYERONLY, buyerController.updateOrderPUT);

//DELETE REQUESTS
buyerRoute.delete('/api/buyer/cart/:productId', BUYERONLY, buyerController.productInCartDELETE);

buyerRoute.delete('/api/buyer/cart/delete', BUYERONLY, buyerController.cartDELETE);

//  buyerRoute.post('/api/buyer/create-order/:seller_id', BUYERONLY,
//     [
//         check('name')
//             .exists()
//             .withMessage('Product name is required')
//             .isString()
//             .withMessage('Product name must be a string')
//             .toLowerCase()
//             .trim()
//         ,
//         check('quantity')
//             .exists()
//             .withMessage('The quantity you want to order is required')
//             .isNumeric()
//             .withMessage('The quantity you want to order must be a number')
//             .isLength({ min: 1 })
//             .withMessage('The least quantity is 1')
//             .trim()
//     ], buyerController.createOrderPOST);


//EXPORTS
module.exports = buyerRoute; 