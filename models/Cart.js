const mongoose = require('mongoose');
const Catalog = require('./Catalog');
const Order = require('./Order');
const User = require('./User');
const cartSchema = new mongoose.Schema({
    buyerID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    products:
        [{
            productID: {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
                ref: 'Catalog',
            },
            name: String,
            quantity: Number,
            price: Number
        }],
    bill: Number
});

cartSchema.methods.getSeller = async function (productID) {
    const sellerID = Catalog
        .findOne({ "products._id": productID })
        .then(catalog => {
            return catalog.seller;
        })
    return sellerID;
};



//static method to get the cart of the buyer that's currently logged in 
cartSchema.statics.retrieveCart = async function (buyerID) {
    const cart = await this.findOne({ buyerID });
    if (!cart || cart.products.length === 0) throw new Error(`Buyer doesn't have a cart.`);
    return cart;
};

//static method that creates a cart || adds products to a cart once the product legibility has been confirmed
cartSchema.statics.cartCreation = async function (buyerID, sellerID, name, quantity) {
    const catalog = await Catalog.retrieveCatalog(sellerID);
    const cart = await this.findOne({ buyerID });
    const productIndex = await catalog.retrieveProductIndex(name);
    const product = catalog.products[productIndex];
    //to also make sure the quantity is not higher than the available quantity.
    if (quantity > product.quantity) throw new Error("Seller doesn't have up to the required quantity.");
    //if buyer cart exists 
    if (cart) {
        //returns -1 if the product isn't in the cart
        const productIndexCart = await cart.retrieveProductIndex(name);
        if (productIndexCart === -1) {
            //pushing the products into the cart
            cart.products.push({ productID: product._id, name, quantity, price: product.price });
            //the reduce function to recalculate the total bill amount
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0);
            await cart.save();
        };
        return cart;
    } else {
        //if buyer doesn't have a cart 
        const newcart = await this.create({
            buyerID, products: [{ productID: product._id, name, quantity, price: product.price }], bill: product.price * quantity
        })
        return newcart;
    }
};

cartSchema.statics.pushCart = async function (buyerID) {
    const cart = await this.retrieveCart(buyerID);

    //creating a order document for the buyer to see orders
    const order = new Order({ buyerID });
    for (let i = 0; i < cart.products.length; i++) {
        const sellerID = await cart.getSeller(cart.products[i].productID);
        order.products.push({
            productID: cart.products[i].productID, quantity: cart.products[i].quantity
        });
        order.bill = 0;
        order.bill += (cart.products[i].quantity * cart.products[i].price)
        User.findById(buyerID).then(async function (seller) {
            seller.orders.push(order._id);
            await seller.save();
        });
    }
    await order.save();
    // delete cart since order has been made.
    // deleteCart(buyerID);
    return order;
};

cartSchema.methods.retrieveProductIndex = async function (productID) {
    const productIndex = this.products.findIndex((product) => {
        return productID === product._id;
    })
    return productIndex;
};

//static method to update the products within a cart
cartSchema.statics.updateCart = async function (buyerID, name, quantity) {
    const cart = await this.retrieveCart(buyerID);
    // retrieving the product from the cart
    const productIndex = await cart.retrieveProductIndex(name);
    const product = cart.products[productIndex];
    // cart.verifyQuantity(quantity, product);
    product.quantity = parseInt(quantity);
    cart.products[productIndex] = product;
    cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0);
    await cart.save();
    return cart;
};

//static method to delete products from a cart
cartSchema.statics.deleteProductInCart = async function (buyerID, productID) {
    console.log(productID);
    const cart = await this.retrieveCart(buyerID);
    const productIndex = cart.products.findIndex(product =>
        product.productID == productID
    );
    if (productIndex === -1) throw new Error(`Item is not in buyer cart.`);
    cart.products.splice(productIndex, 1);
    cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0);
    await cart.save();
    return cart;
};

//static method to delete products from a cart
cartSchema.statics.deleteCart = async function (buyerID) {
    const cart = await this.exists({ buyerID });
    if (!cart) throw new Error(`Buyer doesn't have a cart.`);
    await this.deleteOne({ buyerID });
};

module.exports = mongoose.model('Cart', cartSchema);