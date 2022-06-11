const mongoose = require('mongoose');
const User = require('./User');
// const Order = require('./Order');
const Products = require('./Products');
const objectID = mongoose.SchemaTypes.ObjectId;


const catalogSchema = new mongoose.Schema({
    user: {
         type: objectID,
         required: true,
         ref: 'User'
    },
    products: [{
         type: objectID,
         required: true,
         ref: 'Products'
    }],
    productCount: {
         /* use virtual count*/
          }
    });
    
//static method to push products to a new/existing catalog. 
catalogSchema.statics.catalogCreation = async function(userID,name,price,description){
const catalog = await this.findOne({user:userID});
     if(!catalog){
     const newProduct = await Products.create({name,price,description});
     const newCatalog = new Catalog({user:userID,products:newProduct._id});
     await newCatalog.save();
     }else{
     const newProduct = await Products.create({name,price,description});
     catalog.products.push(newProduct._id);
   }
   };

//static method to get all Catalogs 
catalogSchema.statics.allCatalogs = async function(){
const catalogs = await this.find()
     .populate({path:'user',select: 'name -_id'})
     .populate({path:'products',select: 'name price -_id'})
     .select('user products')
     return catalogs;
};

//static method to get the Catalog of a particular user.
catalogSchema.statics.catalogByID = async function(sellerId){
const user = await Catalog.findOne({user:sellerId});
if(!user){
    throw new Error("Seller not found");
}

if(!user.role === "seller"){
    throw new Error("User is not a seller");
}

if(user.role === "seller"){
const sellerCatalog = await this.findOne({user: sellerId});
return sellerCatalog 
}
};



const Catalog = mongoose.model('catalog',catalogSchema);

module.exports = Catalog;