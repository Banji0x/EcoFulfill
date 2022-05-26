const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
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
     }
});

//mongoose hook to save hash the password
userSchema.pre("save", async function(next){
const salt = await bcrypt.gensalt()
this.password = await bcrypt.hash(this.password,salt);
next();
});

//Static method to verify and login user 
userSchema.statics.login = function(){


};

 //mongoose model
const User = mongoose.model('user',userSchema);

//exports 
module.exports = User;  