const mongoose = require('mongoose');
const Catalog = require('./Catalog');
const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user'
  },
  sellerId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'user'
  },
  products: [{
    productId: {
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

//static method to get buyer orders
orderSchema.statics.getOrdersBuyer = async function (buyerId) {
  const order = await this.find({ buyerId })
    .select('sellerId products bill -_id').lean()
  if (order.length === 0) throw new Error(`Buyer doesn't have any order.`);
  return order;
};
// static method to get orders a seller receieved
orderSchema.statics.getOrdersSeller = async function (sellerId) {
  const order = await this.find({ sellerId })
    .select('buyerId products bill -_id').lean()
  if (order.length === 0) throw new Error(`Seller doesn't have any order.`);
  return order;
};

//static method that will be used alongside the static createOrderUsingCart Cart method to create orders using cart for the buyer
orderSchema.statics.pushOrderFromCart = async function (buyerId, sellerId, productId, quantity, price) {
  const order = await this.findOne({ buyerId, sellerId });
  if (order) {
    //if order document already exists
    order.products.push({ productId, quantity, total: quantity * price });
    //recalculate the total bill
    order.bill = order.products.reduce((acc, curr) => {
      return acc + curr.total;
    }, 0);
    await order.save();
    return;
  } else {
    await this.create({ buyerId, sellerId, products: [{ productId, quantity, total: quantity * price }], bill: price * quantity });
    return;
  }
};

//static method to create an order with either a productId or a productName without having to add the product to cart
orderSchema.statics.createOrder = async function (buyerId, sellerId, identifier, quantity) {
  //retreive seller catalog
  const catalog = await Catalog.retrieveCatalog(sellerId);
  //retrieve product index from catalog
  const productIndex = await catalog.retrieveProductIndex(identifier);
  const product = await catalog.products[productIndex];
  if (quantity > product.quantity) throw new Error("Seller doesn't have up to the required quantity.");
  //create order
  const order = await this.findOne({ buyerId, sellerId });
  if (order) {
    //if order document already exists 
    order.products.push({ productId: product._id, quantity, total: quantity * product.price });
    //recalculate the total bill
    order.bill = order.products.reduce((acc, curr) => {
      return acc + curr.total;
    }, 0);
    await order.save();
    //reduce the product quantity since order is successful
    product.quantity -= quantity;
    catalog.products[productIndex] = product;
    await catalog.save();
    return;
  } else {
    // Create new order
    const newOrder = await this.create({ buyerId, sellerId, products: [{ productId: product._id, quantity, total: product.price * quantity }], bill: product.price * quantity });
    //reduce the product quantity since order is successful
    product.quantity -= quantity;
    catalog.products[productIndex] = product;
    await catalog.save();
    return;
  };
};

//static method to cancel a product that was ordered
orderSchema.statics.deleteOrderedProduct = async function (buyerId, sellerId, productId) {
  const order = await this.findOne({ buyerId, sellerId });
  if (!order || order.length == 0) throw new Error(`Buyer doesn't have any order.`);
  const productIndex = order.products.findIndex(product => product.productId == productId);
  if (productIndex === -1) throw new Error(`Item not in buyer's orders`);
  order.products.splice(productIndex, 1);
  await order.save();
};

//static method to cancels orders sent to a seller
orderSchema.statics.deleteOrder = async function (buyerId, sellerId) {
  const deletedOrders = await this.deleteMany({ buyerId, sellerId });
  if (deletedOrders.deletedCount === 0) throw new Error(`Buyer doesn't have any order with seller.`);
};

// static method to cancel all orders a buyer made 
orderSchema.statics.deleteAllOrders = async function (buyerId) {
  const deletedorders = await this.deleteMany({ buyerId });
  if (deletedorders.deletedCount === 0) throw new Error(`Buyer doesn't have any order.`);
};

// Exporting the mongoose model 
module.exports = mongoose.model('order', orderSchema);