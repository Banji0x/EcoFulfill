const {Router} = require('express');
const sellerControllers = require('../controllers/sellerControllers');

const sellerRouter = Router();

//get request
sellerRouter.get('/api/seller/orders',sellerControllers.createCatalog_post);

//post request
sellerRouter.post('/api/seller/create-catalog',sellerControllers.ordersList_get);


module.exports = sellerRouter; 