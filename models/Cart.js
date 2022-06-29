const mongoose = require('mongoose');
const Catalog = require('./Catalog');
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
                ref: 'Catalog'
            },
            name: String,
            quantity: Number,
            price: Number
        }],
    bill: Number
},
    { timestamps: true }
);

//static method to get the cart of the buyer that's currently logged in 
cartSchema.statics.retrieveCart = async function (buyerID) {
    const cart = await this.findOne({ buyerID });
    console.log(cart);
    if (!cart || cart.products.length === 0) {
        throw new Error(`Buyer doesn't have a cart.`);
    }
    return cart;
};

//static method that creates a cart || adds products to a cart once the product legibility has been confirmed
cartSchema.statics.cartCreation = async function (buyerID, sellerID, name, quantity = 1) {
    const catalog = await Catalog.retrieveCatalog(sellerID);
    const productIndex = await catalog.retrieveProductIndex(name);
    const cart = await this.findOne({ buyerID })
    //if buyer cart already exists but it's empty 
    if (cart) {
        //if the product exists in seller's catalog
        if (productIndex !== -1) {
            const product = catalog.products[productIndex];
            //if the product doesn't exist in the cart
            cart.products.push({ productID: product._id, name, quantity, price: product.price });
            //the reduce function to recalculate the total bill amount
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0);
            await cart.save();
        }
        return cart;
    } else {
        //if buyer doesn't have a cart 
        const newcart = await this.create({
            buyerID, products: [{ productID: product._id, name, quantity, price: product._id }], bill: product.price * quantity
        })
        return newcart
    }

};

//static method to update the products within a cart
cartSchema.statics.updateCart = async function (buyerID, name, quantity = 0) {
    const cart = await this.retrieveCart(buyerID);
    const productIndex = cart.products.findIndex((product) => {
        return name === product.name;
    });
    const product = cart.products[productIndex];
    product.quantity += quantity;
    cart.products[productIndex] = product;
    cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0);
    await cart.save();
};

//static method to delete products from a cart
cartSchema.statics.deleteProductInCart = async function (buyerID, productID) {
    const cart = await this.retrieveCart(buyerID);
    const productIndex = cart.products.findIndex((product) => {
        return productID === product.productID;
    });
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