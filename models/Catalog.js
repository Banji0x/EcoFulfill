const mongoose = require('mongoose');
const User = require('./User');
// const Order = require('./Order');
const Products = require('./Products');
const objectID = mongoose.SchemaTypes.ObjectId;


const catalogSchema = new mongoose.Schema({
    seller: {
         type: objectID,
         required: true,
         ref: 'user'
    },
    products: [{
         type: objectID,
         required: true,
         ref: Products
    }]
    });
    
//static method to push products to a new/existing catalog. 
catalogSchema.statics.catalogCreation = async function(userID,name,price,description){
const catalog = await this.findOne({seller:userID});
      if(!catalog){
           const newProduct = await Products.create({name,price,description});
           const catalog = new Catalog({seller:userID,products:newProduct._id});
           await catalog.save();
      }else{
           const newProduct = await Products.create({name,price,description});
           catalog.products.push(newProduct);
           catalog.save();
     }
     return catalog;
   };

//method to get the products count in a catalog 
catalogSchema.methods.productsCount= function(){
      return this.products.length; 
};


//static method to get all Catalogs 
catalogSchema.statics.allCatalogs = async function(){
     
const catalogs = await this.find()
      .populate({path:'seller',select: 'name -_id'})
      .populate({path:'products',select: 'name price -_id'})
      .select('seller products -_id')

if(catalogs.length===0){
     throw new Error("No catalog was found")
}
     return catalogs;
};

//static method to get the Catalog of a particular user.
catalogSchema.statics.catalogByID = async function(sellerId){
const sellerCatalog = await Catalog.findOne({seller:sellerId})
           .populate({
           path: "products",
           select:"name price description createdOn -_id"})
           .select('seller products -_id');
      if(!sellerCatalog){
      throw new Error("Seller Catalog not found");
      }
return sellerCatalog; 
};


const Catalog = mongoose.model('catalog',catalogSchema);

module.exports = Catalog;