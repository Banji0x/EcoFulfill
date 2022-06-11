const User = require('../models/User');
// const Order = require('./Order');
const Catalog = require('../models/Catalog');


//I still have to handle the error here, something like 
const errHandler = (err)=>{

};

module.exports.sellerRouteAuth = (req,res,next)=>{
    res.status(200).json("Seller verified");
};
    
module.exports.createCatalogPOST = async (req,res)=>{
 try {
     const userID = req.user_id;
     console.log(userID);
     const {name,price,description} = req.body;
     await Catalog.catalogCreation(userID,name,price,description); 
     res.status(201).json("Products added to catalog");
 } catch (err) {
     console.log(err);
     //  errHandler(err)
    }
};

module.exports.ordersListGET = (req,res)=>{
 
};

