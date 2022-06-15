const mongoose = require('mongoose');
const User = require('./User');
// const Order = require('./Order');
const objectID = mongoose.SchemaTypes.ObjectId;

const productSchema= new mongoose.Schema({
     name:{
       type: String,
       required: true,
       lowercase: true,
       trim: true
     },
     price:{
       type: Number,
       required: true
     },
    description:{
       type: String,
       required: true,
       lowercase: true,
    },
    createdOn: {
      type: String,
      default: ()=> new Date().toString(),
      immutable: true
    }
 
 });
 

const catalogSchema = new mongoose.Schema({
    seller: {
         type: objectID,
         required: true,
         ref: 'user'
    },
    products: [productSchema]
    });
    
//static method to push products to a new/existing catalog. 
catalogSchema.statics.catalogCreation = async function(userID,name,price,description){
let catalog = await this.findOne({seller:userID});
      if(!catalog){
           catalog = await Catalog.create({
           seller:userID,
           products:[{name,price,description}]
           });
      }else{
           catalog.seller=userID;
           catalog.products.push({name,price,description});
           await catalog.save(); 
          }
       return catalog;
   };

//static method to get all Catalogs 
catalogSchema.statics.allCatalogs = async function(){
const catalogs = await this.find()
      .populate({path:'seller', select:'_id name'})
      .select('seller products -_id')
      return catalogs;
};

//static method to get the Catalog of a particular user.
catalogSchema.statics.catalogByID = async function(sellerId){
const sellerCatalog = await Catalog.findOne({seller:sellerId})
      .populate({path:'seller', select:'_id name'})
      .select('seller products -_id');
      if(!sellerCatalog){
      throw new Error("Seller Catalog not found");
      }
return sellerCatalog; 
};



const Catalog = mongoose.model('catalog',catalogSchema);

module.exports = Catalog;