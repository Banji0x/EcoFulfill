const mongoose = require('mongoose');
const objectID = mongoose.SchemaTypes.ObjectId;

const productSchema= new mongoose.Schema({
    name:{
      type: String,
      required: true,
      trim: true
    },
    price:{
      type: Number,
      required: true
    },
   description:{
      type: String,
      required: true
   }
});



const Product = mongoose.model('product',productSchema);

module.exports = Product;