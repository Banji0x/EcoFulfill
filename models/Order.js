const mongoose = require('mongoose');
const User = require('./User');
const Catalog = require('./Catalog');
const objectID = require('mongoose.SchemaTypes.ObjectId'); 


const orderSchema = new mongoose.Schema({
     user: {
         type: objectID,
         required:true,
         ref : 'User'
         },
         orders : [] 
});

