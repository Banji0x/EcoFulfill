const mongoose = require('mongoose');
const Catalog = require('./Catalog');
const orderSchema = new mongoose.Schema({
  userId: {
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
  bill: Number
},
  { timestamps: true });

//static method to get buyer orders
orderSchema.statics.getOrders = async function (userId, role) {
  let order;
  if (role === 'buyer') {
    order = await this.find({ userId })
      .select('sellerId products bill -_id').lean();
    if (order.length === 0) throw new Error(`Buyer doesn't have any order.`);
  } else {
    order = await this.find({ sellerId: userId })
      .select('userId products bill -_id').lean();
    if (order.length === 0) throw new Error(`Seller doesn't have any order.`);
  }
  return order;
};

//static method that will be used alongside the static createOrderUsingCart Cart method to create orders using cart for the buyer
orderSchema.statics.pushOrderFromCart = async function (userId, sellerId, productId, quantity, price) {
  const order = await this.findOne({ userId, sellerId });
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
    await this.create({ userId, sellerId, products: [{ productId, quantity, total: quantity * price }], bill: price * quantity });
    return;
  }
};

//static method to create an order with either a productId or a productName without having to add the product to cart
orderSchema.statics.createOrder = async function (userId, sellerId, identifier, quantity) {
  //retreive seller catalog
  const catalog = await Catalog.retrieveCatalog(sellerId);
  //retrieve product index from catalog
  const productIndex = await catalog.retrieveProductIndex(identifier);
  const product = await catalog.products[productIndex];
  if (quantity > product.quantity) throw new Error("Seller doesn't have up to the required quantity.");
  //create order
  const order = await this.findOne({ userId, sellerId });
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
    await this.create({ userId, sellerId, products: [{ productId: product._id, quantity, total: product.price * quantity }], bill: product.price * quantity });
    //reduce the product quantity since order is successful
    product.quantity -= quantity;
    catalog.products[productIndex] = product;
    await catalog.save();
    return;
  };
};

//static method to cancel a product that was ordered
orderSchema.statics.deleteOrderedProduct = async function (userId, sellerId, productId) {
  const order = await this.findOne({ userId, sellerId });
  if (!order || order.length == 0) throw new Error(`Buyer doesn't have any order.`);
  //check if the product is in orders
  const productIndex = order.products.findIndex((item) => {
    return item.productId == productId;
  });
  if (productIndex === -1) throw new Error('Product not in orders.');
  // loop through the products array,find the product and delete
  for (let i = 0; i = order.products.length; i++) {
    const productIndex = order.products.findIndex((item) => {
      return item.productId == productId;
    });
    if (productIndex == -1) break;
    if (productIndex !== -1) {
      order.products.splice(productIndex, 1);
    };
  };
  //recalculate the bill
  order.bill = order.products.reduce((acc, curr) => {
    return acc + curr.total;
  }, 0);
  await order.save();
  //delete order document since there is no product in it.
  if (order.products.length == 0) {
    await this.deleteOne({ userId, sellerId });
  }
};

//static method to cancels all orders sent to a seller
orderSchema.statics.deleteOrders = async function (userId, sellerId) {
  const deletedOrders = await this.deleteOne({ userId, sellerId });
  if (deletedOrders.deletedCount === 0) throw new Error(`Buyer doesn't have any order with seller.`);
};

// static method to cancel all orders a buyer made 
orderSchema.statics.deleteAllOrders = async function (userId) {
  const deletedorders = await this.deleteMany({ userId });
  if (deletedorders.deletedCount === 0) throw new Error(`Buyer doesn't have any order.`);
};

//Exports
module.exports = mongoose.model('order', orderSchema);