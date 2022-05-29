const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');
const {Schema} = mongoose.Schema;

const userSchema = new Schema({
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


//mongoose pre hook to hash the password.
// after the save event is fired, the pre method on the userSchema will automatically update the password with the hashed version. 
userSchema.pre("save", async function(next){
const salt = await bcrypt.genSalt();
this.password = await bcrypt.hash(this.password,salt);
next();
});

//Static method to verify and login user 
userSchema.statics.login = async function(email, password){
//the findOne method checks the Db collection for the email if found, it then stores the document in the user variable.
// "this" refers to the User model 
const user = await this.findOne({email})
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