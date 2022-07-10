const mongoose = require('mongoose');
const Catalog = require('./Catalog');
const Order = require('./Order');
const cartSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    products:
        [{
            productId: {
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

//static method to get seller's catalog using the product Id.
cartSchema.methods.getCatalog = async function (productId) {
    const catalog = await Catalog
        .findOne({ 'products._id': productId })
    return catalog;
};

//static method to get the cart of the buyer that's currently logged in 
cartSchema.statics.retrieveCart = async function (buyerId) {
    const cart = await this.findOne({ buyerId });
    if (!cart || cart.products.length === 0) throw new Error(`Buyer doesn't have a cart.`);
    return cart;
};

//static method that creates a cart || adds products to a cart once the product legibility has been confirmed
cartSchema.statics.cartCreation = async function (buyerId, sellerId, productId, quantity) {
    const catalog = await Catalog.retrieveCatalog(sellerId);
    const cart = await this.findOne({ buyerId });
    //to confirm if the product exists 
    const productIndex = await catalog.retrieveProductIndex(productId);
    const product = catalog.products[productIndex];
    //to verify if the seller available quantity is higher than the quantity the buyer wants to purchase.
    if (quantity > product.quantity) throw new Error(`Seller doesn't have up to the required quantity.`);
    //if buyer cart exists 
    if (cart) {
        //returns -1 if the product isn't already in the cart
        const productIndexCart = await cart.retrieveProductIndex(productId);
        if (productIndexCart === -1) {
            //product isn't in cart yet,push product into cart
            cart.products.push({ productId: product._id, name: product.name, quantity, price: product.price });
            //the reduce function to calculate the total bill amount
            cart.bill = cart.products.reduce((acc, curr) => {
                return acc + curr.quantity * curr.price;
            }, 0);
            await cart.save();
        };
        return cart;
    } else {
        //if buyer doesn't have a cart 
        const newcart = await this.create({
            buyerId, products: [{ productId: product._id, name: product.name, quantity, price: product.price }], bill: product.price * quantity
        })
        return newcart;
    }
};

//static method that creates orders using products added to cart 
cartSchema.statics.createOrderUsingCart = async function (buyerId) {
    const cart = await this.retrieveCart(buyerId);
    for (let i = 0; i < cart.products.length; i++) {
        const { productId, quantity, price } = cart.products[i];
        const catalog = await cart.getCatalog(productId);
        const { sellerId } = catalog;
        //create order
        await Order.pushOrderFromCart(buyerId, sellerId, productId, quantity, price);
        //retrieveProductIndex from catalog
        const productIndex = await catalog.retrieveProductIndex(productId);
        //reduce the product quantity
        catalog.products[productIndex].quantity -= quantity;
        //save catalog
        await catalog.save();
    }
    //delete the cart since orders has been pushed to thier respective sellers.
    await this.deleteOne({ buyerId });
};

// static method that retrieves the index of a product added to cart
cartSchema.methods.retrieveProductIndex = async function (productId) {
    if (!mongoose.isValidObjectId(productId)) throw Error('Invalid Id provided.')
    const productIndex = this.products.findIndex(product => product.productId == productId);
    return productIndex;
};

//static method to update products within a cart
cartSchema.statics.updateCart = async function (buyerId, productId, quantity) {
    const cart = await this.retrieveCart(buyerId);
    // retrieving the product from the cart
    const productIndex = await cart.retrieveProductIndex(productId);
    if (productIndex === -1) throw new Error(`Item not in buyer's cart.`)
    //to verify if the seller has up to the quantity the buyer wants to add to cart
    await Catalog.retrieveQuantity(productId, quantity);
    const product = cart.products[productIndex];
    product.quantity = parseInt(quantity);
    cart.products[productIndex] = product;
    cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0);
    await cart.save();
    return cart;
};

//static method to delete products from a cart
cartSchema.statics.deleteProductInCart = async function (buyerId, productId) {
    const cart = await this.retrieveCart(buyerId);
    const productIndex = cart.products.findIndex(product =>
        product.productId == productId
    );
    if (productIndex === -1) throw new Error(`Item not in buyer's cart.`);
    cart.products.splice(productIndex, 1);
    cart.bill = cart.products.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
    }, 0);
    await cart.save();
    return cart;
};

//static method to delete products from a cart
cartSchema.statics.deleteCart = async function (buyerId) {
    const deletedCart = await this.deleteOne({ buyerId });
    if (deletedCart.deletedCount === 0) throw new Error(`Buyer doesn't have a cart.`);

};

module.exports = mongoose.model('Cart', cartSchema);