const { Router } = require('express');
const sellerController = require('../controllers/sellerController');
const { sellerOnly } = require('../middleware/authMiddleware');
const { check } = require('express-validator');
const sellerRoute = Router();

//GET REQUESTS
//Route for the seller to get his/her catalog
sellerRoute.get('/api/seller/catalog', sellerOnly, sellerController.sellerCatalogGET);

//Route for the seller to retrieve his/her orders
sellerRoute.get('/api/seller/orders', sellerOnly, sellerController.ordersListGET);

//POST REQUESTS 
//Route for the seller to add products to a new/existing catalog
sellerRoute.post('/api/seller/create-catalog', sellerOnly, [
    check('name')
        .exists()
        .withMessage('The product you want to add to the catalog requires a name')
        .isString()
        .withMessage('Product name must be a string')
        .isLength({ min: 3, max: 10 })
        .withMessage('Character length must be between 3 and 10')
        .toLowerCase()
        .trim()
    ,
    check('quantity')
        .exists()
        .withMessage('The product requires a quantity')
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
//Route for the seller to update a product in his/her catalog using the product id
//Seller can update the product name||quantity||price||category||description
sellerRoute.patch('/api/seller/catalog/:productId', sellerOnly, [
    check('name')
        .optional()
        .isString()
        .withMessage('Product name must be a string')
        .isLength({ min: 3, max: 20 })
        .withMessage('Character length must be between 3 and 20')
        .toLowerCase()
        .trim()
    ,
    check('quantity')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Product quantity must be a number greater than zero')
    ,
    check('price')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Product price must be a number greater than zero')
    , check('category')
        .optional()
        .isString()
        .withMessage('Category must be a string')
    ,
    check('description')
        .optional()
        .isString()
        .withMessage('Product description must be a string')
        .isLength({ min: 10, max: 150 })
        .withMessage('Character length must be between 30 and 150')
        .toLowerCase()
        .trim()

], sellerController.updateCatalogPATCH);

//DELETE REQUESTS
//Route for the seller to delete a product from his/her existing catalog
sellerRoute.delete('/api/seller/catalog/:productId', sellerOnly, sellerController.deleteProductFromCatalog);

//Route for the seller to delete his/her catalog
sellerRoute.delete('/api/seller/delete-catalog', sellerOnly, sellerController.CatalogDELETE);

//EXPORTS
module.exports = sellerRoute;
