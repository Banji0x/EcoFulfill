const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
// const Order = require('./Order');
const Catalog = require('./Catalog');
const objectID = mongoose.SchemaTypes.ObjectId;

const userSchema = new mongoose.Schema({
name: {
        type: String,
        required: true,
        lowercase: true,
        minlength: [3,"Minimum character Length is 3 "]
       },      
email: {
       type: String,
       required: [true,"Please Enter an Email address"],
       unique: true,
       lowercase: true,
       validate: [isEmail,"Please Enter a Valid Email address"]
       },
password: {
       type: String,
       required: [true,"Please Enter a Password"],
       lowercase:true,
       minlength: [8,"Minimum Password Length is 8 Characters"],
       validate: [(value)=>{
                  if(!value.includes('password')){
                    return true;
                  }
                  },
               `The password field shouldn't contain "password" `
                 ] 
           },
role:    {
       type:String, 
       required:[true,"Please select an option"],
       enum:["Buyer","Seller"] 
         },
catalog:[{
               type: objectID, ref:'Catalog' 
        }],
orders:[{
               type: objectID, ref:'Order'
       }]
});


//mongoose pre hook to hash the password.
// after the save event is fired, the pre method on the userSchema will automatically update the password with the hashed version. 
userSchema.pre("save", async function(next){
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt);
next();
 });

//Static method to verify and login user 
userSchema.statics.login = async function(email, password){
//the findOne method checks the Db collection for the email if found, it then stores the document as an object in the user variable.
// "this" refers to the User model 
const user = await this.findOne({email});
if(user){ 
const validation = await bcrypt.compare(user.password,password)
if(!validation){
     return user;
}else{
     throw Error("Incorrect password!!!");
} 
}else{
     throw Error("Email not found!!!")
}
 };

//static method to get all Sellers id && name. 
userSchema.statics.allSellers = async function(){
      const sellers = await this.find({role: 'Seller'}).select('name email');  
      return sellers;
     };

 //mongoose model 
const User = mongoose.model('user',userSchema);

//exports 
module.exports = User;  