const mongoose = require('mongoose');
const argon2 = require('argon2');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
      name: String,
      email: {
            type: String,
            unique: true
      },
      password: String,
      role: {
            type: String,
            default: "buyer",
            enum: ["buyer", "seller"]
      },
      catalog: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'catalog' }],
      orders: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'order' }]
});

//mongoose pre hook.
userSchema.pre('save', async function () {
      this.password = await argon2.hash(this.password);
      this.name = this.name.toLowerCase();
});

// method to automatically generateJwtToken.
userSchema.methods.generateJwtToken = async function () {
      if (this.role === "buyer") {
            return jwt.sign({ _id: this._id.toString() }, process.env.JWTBUYERSECRET);

      } else {
            return jwt.sign({ _id: this._id.toString() }, process.env.JWTSELLERSECRET);
      }
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
            .select('name email');
      return sellers;
};

userSchema.statics.retrieveOrders = async function (sellerID) {
      const orders = await this.findById(sellerID)
            .populate({ path: 'orders', select: 'buyerID products -products["bill"] -_id' })
            .select('name orders');
      return orders
};

userSchema.statics.deleteAccount = async function (userID) {
      const x = await this.exists({ _id: userID });
      await this.deleteOne({ _id: userID });
};

// Exporting the mongoose model 
module.exports = mongoose.model('user', userSchema);


