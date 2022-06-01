const {Router} = require('express');
const buyerControllers = require('../controllers/buyerControllers');
const buyerrouter = Router();

//get requests
buyerrouter.get('/api/buyer/list-of-sellers',buyerControllers.sellerList_get);

buyerrouter.get('/api/buyer/seller-catalog',buyerControllers.sellerCatalog_get);
//post request
buyerrouter.post('/api/buyer/create-order/:seller_id',buyerControllers.createOrder_post);



module.exports = buyerrouter; 