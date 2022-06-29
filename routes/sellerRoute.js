
const { Router } = require('express');
const sellerController = require('../controllers/sellerController');
const { SELLERONLY } = require('../middleware/routeProtection');
const { check } = require('express-validator');
const sellerRoute = Router();

//GET REQUESTS
sellerRoute.get('/api/seller', SELLERONLY, sellerController.sellerRouteAuth);

sellerRoute.get('/api/seller/orders', SELLERONLY, sellerController.ordersListGET);

//POST REQUESTS
sellerRoute.post('/api/seller/create-catalog', SELLERONLY,
    [
        check('name')
            .exists()
            .withMessage('The product you want to add to the catalog requires a name')
            .isString()
            .withMessage('Product name must be a string')
            .isLength({ min: 3, max: 20 })
            .withMessage('Character length must be between 3 and 20')
            .toLowerCase()
            .trim()
        ,
        check('quantity')
            .isNumeric()
            .withMessage('Product name must be a number')
        ,
        check('price')
            .exists()
            .withMessage('The product requires a price')
            .isNumeric()
            .withMessage('Product price must be a number')
        ,
        check('description')
            .exists()
            .withMessage('The product requires a description')
            .isString()
            .withMessage('Product description must be a string')
            .isLength({ min: 30, max: 350 })
            .withMessage('Character length must be between 30 and 150')
            .toLowerCase()
            .trim()

    ], sellerController.createCatalogPOST);

//PUT REQUESTS
sellerRoute.put('/api/seller/update-catalog', SELLERONLY, [
    check('name')
        .exists()
        .withMessage('The product you want to update requires a name')
        .isString()
        .withMessage('Product name must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Character length must be between 3 and 20')
        .toLowerCase()
        .trim()
    ,
    check('quantity')
        .isNumeric()
        .withMessage('Product name must be a number')
    ,
    check('price')
        .isNumeric()
        .withMessage('Product price must be a number')
    ,
    check('description')
        .isString()
        .withMessage('Product description must be a string')
        .isLength({ min: 30, max: 350 })
        .withMessage('Character length must be between 30 and 150')
        .toLowerCase()
        .trim()
], sellerController.updateCatalogPUT)

//DELETE REQUESTS
sellerRoute.delete('/api/seller/:name', SELLERONLY, [
    check('name')
        .exists()
        .withMessage('The product you want to delete requires a name')
        .isString()
        .withMessage('Product name must be a string')], sellerController.deleteProductFromCatalog)


//EXPORTS
module.exports = sellerRoute; 