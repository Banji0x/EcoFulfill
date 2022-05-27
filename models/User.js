const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
email:   {
         type: String,
         required: [true,"Please enter an Email address"],
         unique: true,
         lowercase: true,
         validate: [isEmail,"Please enter a valid email address"]
         },
password: {
         type: String,
         required: [true,"Please enter Password"],
         minlength: [8,"Minimum password length is 8 characters"] 
          },
option:   {
          type:String, 
          required:[true,"Please select an option"],
          enum:["buyer","seller"]
          }    
});

//mongoose hook to save hash the password
userSchema.pre("save", async function(next){
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt);
next();
});

//Static method to verify and login user 
userSchema.statics.login = async function(email, password){
//the findOne method checks the Db collection for email if found, it then stores the document in the user variable.
const user = await this.findOne({email});
if(user){
const authentication = await bcrypt.compare(password,user.password);
if(authentication===true){
     return user;
}else{
     throw Error("Incorrect password!!!");
} 
}else{
     throw Error("Email not found!!!")
}
};

 //mongoose model
const User = mongoose.model('user',userSchema);

//exports 
module.exports = User;  