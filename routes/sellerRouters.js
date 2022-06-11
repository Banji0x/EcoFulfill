const {Router} = require('express');
const sellerControllers = require('../controllers/sellerControllers');
const {SellerOnly} = require('../middleware/routeProtection');

const sellerRouters = Router();

//get request
sellerRouters.get('/api/seller',SellerOnly,sellerControllers.sellerRouteAuth);

// sellerRouters.get('/api/seller/orders',SellerOnly,sellerControllers.createCatalogPOST);

//post request
sellerRouters.post('/api/seller/create-catalog',SellerOnly,sellerControllers.createCatalogPOST);


module.exports = sellerRouters; 