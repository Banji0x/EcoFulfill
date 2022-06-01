const mongoose = require('mongoose');
const {isCurrency} = require('validator');
const catalogSchema = new mongoose.Schema({
    user: {
         /* reference user id here */},
    productCount: {
         /* use virtual count*/
          },
    products: [{
         name:{
             type: String,
             required: true,
             },
         price:{
            type: Number,
            required: true,
            validate:[isCurrency,"Please enter a valid currency"]

         }
    }],
    });
    
const Catalog = mongoose.model('catalog',catalogSchema);

module.exports = Catalog;