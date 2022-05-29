const mongoose = require('mongoose');
const {isEmail} = require('validator')

const userSchema = new mongoose.Schema({
email: {
     type: String,
     required: [true,"Please enter an Email address"],
     lowercase: true,
     validate: [isEmail,"Please enter a valid email address"]
},
password: {
      type: String,
     required: [true,"Please enter Password"],
     minlength: [8,"Minimum password length is 8 characters"]
},
role: {
     type:String, 
     required:[true,"Please select an option"],
     enum:["buyer","seller"]
},
catalog: [{type: mongoose.Schema.Types.ObjectId, ref: "Catalog" }],
orders : [{type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
});

const catalogSchema = new mongoose.Schema({
user: {
     /* reference user id here */

},
productCount: {
     /* use virtual count*/
      },
products: [{name:'',price: ''}],
});

const orderSchema = new mongoose.Schema({
user: {
      /* reference user id here */
    },
orderCount: {
     /* use virtual count*/
     },
orders : [/* push products ids here and virtually populate them */]
});

const User = mongoose.model('user',userSchema)
const Order = mongoose.model('order',orderSchema)
const Catalog = mongoose.model('catalog',catalogSchema);

module.exports = {User, Order, Catalog};



//userSchema.statics is a function on the actual User model itself
//Userschema.methods is a function on the instance of the user generated from the user model 