const mongoose = require('mongoose');
const Catalog = require('./Catalog');

const orderSchema = new mongoose.Schema({
  buyerID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user'
  },
  products: [{
    productID: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'catalog'
    },
    quantity: {
      type: Number,
      default: 1
    },
    bill: {
      type: Number,
      required: true
    },
  }]
},
  { timestamps: true });

  //work on this, it needs to be pushed to the seller
orderSchema.statics.getOrders = async function (buyerID) {
  const order = await this.findOne({ buyerID });
  if (!order) throw new Error(`Buyer doesn't have any order.`);
  return order;
};


orderSchema.statics.createOrder = async function (buyerID, sellerID, name, quantity = 0) {
  const catalog = await Catalog.retrieveCatalog(sellerID);
  const productIndex = await Catalog.retrieveProductIndex(name);
  const product = catalog.products[productIndex];
  if (quantity > product.quantity || product.quantity === 0) {
    throw new Error('Insufficient product quantity')
  };
  //order created
  const order = await this.create({ buyerID, products: [{ productID: product._id, quantity, bill: product.bill }] });
  return order;
};

orderSchema.statics.deleteOrder = async function(buyerID){
  const order = await this.exists({ buyerID });
  if (!order) throw new Error(`Buyer doesn't have any order.`);
  await this.deleteOne({ buyerID });
};




// Exporting the mongoose model 
module.exports = mongoose.model('order', orderSchema);