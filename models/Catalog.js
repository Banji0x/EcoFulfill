const mongoose = require("mongoose");
const User = require("./User");
const catalogSchema = new mongoose.Schema({
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "user"
  },
  products: [{
    name: String,
    price: Number,
    quantity: Number,
    category: {
      type: String,
      default: "general merchandize"
    },
    description: String,
  }]
},
  { timestamps: true });

//static method to retrieve all Catalogs 
catalogSchema.statics.allCatalogs = async function () {
  const catalogs = await this.find()
    .populate({ path: 'seller', select: 'name -_id' })
    .select('seller products ')
  return catalogs;
};

//static method to retrieve a seller's catalog
catalogSchema.statics.retrieveCatalog = async function (sellerID) {
  const catalog = await this.findOne({ seller: sellerID });
  if (!catalog) throw new Error(`Seller doesn't have a catalog.`);
  return catalog;
};

//static method to retrieve the seller's Catalog 
catalogSchema.statics.getSellerCatalog = async function (sellerID) {
  const user = await User.findById(sellerID);
  if (!user || user.role !== 'Seller') throw new Error('Seller not found.');
  const catalog = await this.retrieveCatalog(sellerID)
    .populate({ path: 'seller', select: '_id name' })
    .select('seller products -_id');
  return catalog;
};

//method to retrieve a product Index from the catalog
catalogSchema.methods.retrieveProductIndex = async function (name) {
  const productIndex = await this.products.findIndex(product => product.name === name);
  if (productIndex === -1) throw new Error('Item not in seller catalog.');
  return productIndex;
};

//static method to push products to a new/existing catalog.
catalogSchema.statics.createCatalog = async function (sellerID, name, price, quantity = 1, description) {
  const catalog = await this.findOne({ seller: sellerID });
  //if catalog exists
  if (catalog) {
    const productIndex = this.products.findIndex(product => product.name === name);
    //if the product doesn't exist, add it to the catalog
    if (productIndex === -1) {
      catalog.products.push({ name, price, quantity, description });
      await catalog.save();
    }
    return catalog;
  } else {
    //if catalog doesn't exist
    const newCatalog = await this.create({ seller: sellerID, products: [{ name, price, description }] })
    User.findById(sellerID).then(async function (err, user) {
      if (err) console.log(err.message);
      user.catalog = newCatalog._id;
      await user.save();
    })
    return newCatalog;
  }
};

//static method to update products in a catalog
catalogSchema.statics.updateCatalog = async function (sellerID, name, price = 0, quantity = 0) {
  const catalog = await this.retrieveCatalog(sellerID);
  const productIndex = await catalog.retrieveProductIndex(name);
  const product = catalog.products[productIndex];
  product.name = name;
  product.price += price;
  product.quantity += quantity;
  catalog.products[productIndex] = product;
  await catalog.save();
  return catalog;
};

//static method to delete products in a catalog
catalogSchema.statics.deleteProduct = async function (sellerID, name) {
  const catalog = await this.retrieveCatalog(sellerID);
  const productIndex = await catalog.retrieveProductIndex(name);
  catalog.products.splice(productIndex, 1);
  await catalog.save();
}

//static method to delete a catalog 
catalogSchema.statics.deleteCatalog = async function (sellerID) {
  //if the catalog exists 
  const seller = this.exists({ seller: sellerID });
  if (!seller) throw new Error(`Seller doesn't have a catalog.`)
  await this.deleteOne({ seller: sellerID });
  return
};

// Exporting the mongoose model 
module.exports = mongoose.model('catalog', catalogSchema);;
