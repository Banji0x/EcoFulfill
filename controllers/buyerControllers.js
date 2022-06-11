const User = require('../models/User');
// const Order = require('./Order');
const Catalog = require('../models/Catalog');

//I still have to handle the error here, something like 
const errHandler = (err)=>{

};

module.exports.buyerRouteAuth = (req,res,next)=>{
res.status(200).json("Buyer verified");
};

//GET REQUESTS 
module.exports.allSellersGET = async (req,res)=>{
//get all sellers in a list including their name and _id
 try {
      const sellers = await User.allSellers();
      res.status(201).json({sellers});
    } catch (err) {
      console.log(err);
      errHandler(err)
    }
};

module.exports.allCatalogsGET = async (req, res) => {
 try {
     const catalogs = await Catalog.allCatalogs();
     res.status(201).json(catalogs);
 } catch (err) {
     console.log(err);
     errHandler(err)
}
};

module.exports.sellerCatalogGET = (req,res)=>{
 try {
     const sellerId = req.params.seller_id;
     const sellerCatalog = Catalog.catalogByID(sellerId);
     res.status(201).json(sellerCatalog);

 } catch (err) {
     console.log(err);
     errHandler(err)
 }    

};

//POST REQUESTS
module.exports.createOrderPOST = (req,res)=>{
 try {
    
 } catch (err) {
     console.log(err);
     errHandler(err)
 }

};

