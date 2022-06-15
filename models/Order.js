const mongoose = require('mongoose');
const User = require('./User');
const Catalog = require('./Catalog');
const objectID = mongoose.SchemaTypes.ObjectId;

const orders = new mongoose.Schema({
   productID:{
      type:objectID,
      required:true,
      ref: 'Catalog'
     },
   quantity:{
      type: Number,
      required:true
     },
   total:{
      type: Number,
      required:true
     }
}); 


 const orderSchema = new mongoose.Schema({
       buyerID: {
         type: objectID,
         required:true,
         lowercase: true,
         ref : 'user'
         },
       orders: [orders] 
 });

 async function findProduct(sellerID,name){
 const sellerCatalog = await Catalog.findOne({seller: sellerID});
 if(sellerCatalog){
 const findItem = sellerCatalog.products.find((item)=>{
 return item.name === name
 });
 if (!findItem) {
   throw new Error(`Item not in Seller: ${sellerID} catalog`)
 }
 return findItem;
 }else{
  throw new Error(`${sellerID} not a valid Seller`);
 }

}


orderSchema.statics.createOrder = async function(buyerID,sellerID,name, quantity){
   const product = await findProduct(sellerID,name);
   const order = await Order.create({buyerID,orders:{productID:product._id,quantity:quantity,total:product.price * quantity}});
   return order;
};

const Order = mongoose.model('order',orderSchema);

module.exports = Order;