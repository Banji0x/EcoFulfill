const User = require('../models/User');
const Order = require('../models/Order');
const Catalog = require('../models/Catalog');

//I still have to handle the error here, something like 
const errHandler = (err)=>{};

module.exports.buyerRouteAuth = (req,res,next)=>{
 res.status(200).json(`Buyer ${req.user_id} verified`);
};

//GET REQUESTS 
module.exports.allSellersGET = async (req,res)=>{
//get all sellers in a list including their name and _id
 try {
      const sellers = await User.allSellers();
      console.log(sellers);
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

module.exports.sellerCatalogGET = async (req,res )=>{
const sellerId = req.params.seller_id;
  try {
     const sellerCatalog = await Catalog.catalogByID(sellerId);
     res.status(201).json(sellerCatalog);
}catch (err) {
     console.log(err);
     errHandler(err)
 }    

};

//POST REQUESTS
//Send a list of items to create an order for seller with id = seller_id
module.exports.createOrderPOST = async (req,res)=>{
  const buyerID = req.user_id;
  const sellerID = req.params.seller_id;
  let {name,quantity} = req.body
  name = name.toLowerCase();
    try {
      const order = await Order.createOrder(buyerID,sellerID,name,quantity);
      res.status(200).json(order);
   } catch (err) {
     console.log(err.message);
    //  errHandler(err)
 }

};

