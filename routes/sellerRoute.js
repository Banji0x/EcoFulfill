const { Router } = require('express');
const sellerController = require('../controllers/sellerController');
const { SELLERONLY } = require('../middleware/routeProtection');
const { check } = require('express-validator');
const sellerRoute = Router();

//GET REQUESTS
sellerRoute.get('/api/seller', SELLERONLY, sellerController.sellerRouteAuth);
sellerRoute.get('/api/seller/catalog', SELLERONLY, sellerController.sellerCatalogGET);
sellerRoute.get('/api/seller/orders', SELLERONLY, sellerController.ordersListGET);

//POST REQUESTS 
sellerRoute.post('/api/seller/create-catalog', SELLERONLY, [
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
        .default(1)
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a number greater than zero')
    ,
    check('price')
        .exists()
        .withMessage('The product requires a price')
        .isInt({ min: 1 })
        .withMessage('Product price must be a number greater than zero')
    , check('category')
        .exists()
        .withMessage('The product requires a price')
        .isString()
        .withMessage('Category must be a string')
    ,
    check('description')
        .exists()
        .withMessage('The product requires a description')
        .isString()
        .withMessage('Product description must be a string')
        .isLength({ min: 10, max: 150 })
        .withMessage('Character length must be between 30 and 150')
        .toLowerCase()
        .trim()

], sellerController.createCatalogPOST);

//PATCH REQUESTS
sellerRoute.patch('/api/seller/catalog/:productId', SELLERONLY, [
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
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a number greater than zero')
    ,
    check('price')
        .exists()
        .withMessage('The product requires a price')
        .isInt({ min: 1 })
        .withMessage('Product price must be a number greater than zero')
    , check('category')
        .exists()
        .withMessage('A category is required')
        .isString()
        .withMessage('Category must be a string')
    ,
    check('description')
        .exists()
        .withMessage('The product requires a description')
        .isString()
        .withMessage('Product description must be a string')
        .isLength({ min: 10, max: 150 })
        .withMessage('Character length must be between 30 and 150')
        .toLowerCase()
        .trim()

], sellerController.updateCatalogPATCH)

//DELETE REQUESTS
sellerRoute.delete('/api/seller/catalog/:productId', SELLERONLY, sellerController.deleteProductFromCatalog)

sellerRoute.delete('/api/seller/delete-catalog', SELLERONLY, sellerController.CatalogDELETE)

//EXPORTS
module.exports = sellerRoute;
