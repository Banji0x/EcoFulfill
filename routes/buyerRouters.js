const {Router} = require('express');
const buyerControllers = require('../controllers/buyerControllers');
const {BuyerOnly} = require('../middleware/routeProtection');

const buyerRouters = Router();

//GET REQUESTS
buyerRouters.get('/api/buyer',BuyerOnly,buyerControllers.buyerRouteAuth);
buyerRouters.get('/api/buyer/list-of-sellers',BuyerOnly,buyerControllers.allSellersGET);

buyerRouters.get('/api/buyer/sellers-catalog',BuyerOnly,buyerControllers.allCatalogsGET);

buyerRouters.get('/api/buyer/seller-catalog/:seller_id',BuyerOnly,buyerControllers.sellerCatalogGET);

//POST REQUESTS
buyerRouters.post('/api/buyer/create-order/:seller_id',BuyerOnly,buyerControllers.createOrderPOST);


module.exports = buyerRouters; 