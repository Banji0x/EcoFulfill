const mongoose = require('mongoose');
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
      name: String,
      email: {
            type: String,
            unique: true,
            required: true
      },
      password: String,
      role: {
            type: String,
            default: "buyer",
            enum: ["buyer", "seller"]
      },
      catalog: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'catalog'
      }
});

//Pre-hook method to hash password before it's saved to db && to convert the name to lowercase
userSchema.pre('save', async function () {
      this.password = await argon2.hash(this.password);
      this.name = this.name.toLowerCase();
});

//Method to automatically generateJwtToken.
userSchema.methods.generateJwtToken = async function () {
      if (this.role === "buyer")
            return jwt.sign({ _id: this._id.toString() }, process.env.JWTBUYERSECRET);
      else
            return jwt.sign({ _id: this._id.toString() }, process.env.JWTSELLERSECRET);
};

//Static method to verify and login user.
userSchema.statics.login = async function (email, password) {
      //the findOne method checks the Db collection for the email if found, it then stores the document as an object in the user variable.
      // "this" refers to the User model 
      const user = await this.findOne({ email });
      if (!user) throw new Error("Email has not been registered.");
      const verified = await argon2.verify(user.password, password)
      if (!verified) throw new Error("Password entered is incorrect.")
      return user;
};

//static method to get all Sellers id && name. 
userSchema.statics.allSellers = async function () {
      const sellers = await this.find({ role: 'seller' })
            .select('name email').lean()
      if (sellers.length === 0) throw new Error(`Seller not found.`)
      return sellers;
};

userSchema.statics.deleteAccount = async function (userId) {
      const deletedUser = await this.deleteOne({ _id: userId });
      if (deletedUser.deletedCount === 0) throw new Error(`Account not found.`);
};
// Exporting the mongoose model 
module.exports = mongoose.model('user', userSchema);

