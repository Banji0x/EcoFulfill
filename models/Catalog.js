const mongoose = require("mongoose");
const User = require("./User");

const products = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const catalogSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "user"
  },
  products: [products]
},
  { timestamps: true });

//static method to retrieve all Catalogs 
catalogSchema.statics.allCatalogs = async function () {
  const catalogs = await this.find()
    .populate({ path: 'sellerId', select: 'name' })
    .select('sellerId products ').lean()
  if (catalogs.length == 0) throw new Error('No catalog was found.')
  return catalogs;
};

//static method to retrieve the seller's Catalog 
catalogSchema.statics.getCatalogById = async function (sellerId) {
  const catalog = await this.findOne({ sellerId }).lean();
  if (!catalog) throw new Error('No catalog was found.');
  return catalog;
};

//static method to push products to a new/existing catalog.
catalogSchema.statics.createCatalog = async function (sellerId, name, price, quantity, category, description) {
  const catalog = await this.findOne({ sellerId });
  //if catalog exists
  if (catalog) {
    //retrieve the product index 
    const productIndex = catalog.products.findIndex(product => product.name === name);
    if (productIndex === -1) {
      //if the product doesn't exist, add it to the catalog
      catalog.products.push({ name, price, quantity, category, description });
      await catalog.save();
    }
    return catalog;
  } else {
    //if catalog doesn't exist
    const newCatalog = await this.create({ sellerId, products: [{ name, price, quantity, category, description }] });
    //push catalog document Id to buyer
    User.findByIdAndUpdate(sellerId, { $push: { catalog: newCatalog._id } });
    return newCatalog;
  }
};

//method to retrieve a product Index from the catalog a identifier
//identifier can either be a product id or the product name 
catalogSchema.methods.retrieveProductIndex = async function (identifier) {
  let productIndex;
  //if the product identifier is an ObjectId
  if (mongoose.isValidObjectId(identifier)) {
    productIndex = await this.products.findIndex(product => product._id.toString() == identifier.toString());
    if (productIndex === -1) throw new Error('Item not in seller catalog.');
  } else if (!mongoose.isValidObjectId(identifier) && typeof identifier === "string") {
    //if the product identifier is a product name 
    productIndex = await this.products.findIndex(product => product.name == identifier);
    if (productIndex === -1) throw new Error('Item not in seller catalog.');
  }
  return productIndex;
};

//static method to verify a product quantity
catalogSchema.statics.retrieveQuantity = async function (productId, quantity) {
  const catalog = await this.findOne({ 'products._id': productId });
  const productIndex = await catalog.retrieveProductIndex(productId);
  const product = catalog.products[productIndex];
  if (quantity > product.quantity) throw new Error("Seller doesn't have up to the required quantity.");
  return;
};

//static method to retrieve a seller's catalog
catalogSchema.statics.retrieveCatalog = async function (sellerId) {
  const catalog = await this.findOne({ sellerId });
  if (!catalog) throw new Error(`Seller doesn't have a catalog.`);
  return catalog;
};

//static method to update products in a catalog
catalogSchema.statics.updateCatalog = async function (sellerId, productId, name, price, quantity, description) {
  const catalog = await this.retrieveCatalog(sellerId);
  const productIndex = await catalog.retrieveProductIndex(productId);
  const product = catalog.products[productIndex];
  product.name = name;
  product.price = parseInt(price);
  product.quantity = parseInt(quantity);
  product.description = description;
  catalog.products[productIndex] = product;
  await catalog.save();
  return catalog;
};

//static method to delete products in a catalog
catalogSchema.statics.deleteProduct = async function (sellerId, productId) {
  const catalog = await this.retrieveCatalog(sellerId);
  const productIndex = await catalog.retrieveProductIndex(productId);
  catalog.products.splice(productIndex, 1);
  await catalog.save();
};

//static method to delete a catalog 
catalogSchema.statics.deleteCatalog = async function (sellerId) {
  const deletedCatalog = await this.deleteOne({ seller: sellerId });
  if (deletedCatalog.deletedCount === 0) throw new Error(`Seller doesn't have a catalog.`)
  //delete catalog document id from the user document
  User.findByIdAndUpdate(sellerId, { catalog: undefined });
};

// Exporting the mongoose model 
module.exports = mongoose.model('catalog', catalogSchema);