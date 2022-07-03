const mongoose = require('mongoose');
const Catalog = require('./Catalog');
const User = require('./User');

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user'
  },
  products: [{
    productID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'catalog'
    },
    quantity: Number,
    status: {
      type: String,
      default: 'pending'
    },
    total: Number
  }],
  bill: Number,
  dateAdded: {
    type: Date,
    immutable: true,
    default: () => { Date.now() }
  }
});

orderSchema.statics.getOrders = async function (buyerID) {
  const order = await this.find({ userID: buyerID });
  if (!order) throw new Error(`Buyer doesn't have any order.`);
  return order;
};

orderSchema.statics.createOrder = async function (buyerID, sellerID, name, quantity) {
  const catalog = await Catalog.retrieveCatalog(sellerID);
  const productIndex = await catalog.retrieveProductIndex(name);
  const product = catalog.products[productIndex];
  if (quantity > product.quantity) throw new Error("Seller doesn't have up to the required quantity.");
  // Create order
  const order = new this({ userID: buyerID, products: [{ productID: product._id, quantity }] });
  //calculate the bill by iterating through the array.
  order.bill = order.products.reduce((acc, curr) => {
    return acc + curr.quantity * product.price;
  }, 0);
  await order.save();
  //push order._id to seller
  User.findById(sellerID).then(async function (user) {
    user.orders.push(order._id);
    await user.save();
  });
  //push order._id to buyer
  User.findById(buyerID).then(async function (user) {
    user.orders.push(order._id);
    await user.save();
  });
  return order._id;
};

orderSchema.statics.deleteOrder = async function (buyerID) {
  const order = await this.exists({ buyerID });
  if (!order) throw new Error(`Buyer doesn't have any order.`);
  await this.deleteOne({ buyerID });
};

// Exporting the mongoose model 
module.exports = mongoose.model('order', orderSchema);