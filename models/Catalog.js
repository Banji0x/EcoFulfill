const mongoose = require("mongoose");
const User = require("./User");
const catalogSchema = new mongoose.Schema({
  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "user"
  },
  products: [{
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
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

//method to retrieve a product Index from the catalog
catalogSchema.methods.retrieveProductIndex = async function (name) {
  const productIndex = await this.products.findIndex(product => product.name === name);
  if (productIndex === -1) throw new Error('Item not in seller catalog.');
  return productIndex;
};

//static method to retrieve a sell

//static method to retrieve a seller's catalog
catalogSchema.statics.retrieveCatalog = async function (sellerID) {
  const catalog = await this.findOne({ seller: sellerID });
  if (!catalog) throw new Error(`Seller doesn't have a catalog.`);
  return catalog;
};

//static method to retrieve the seller's Catalog 
catalogSchema.statics.getSellerCatalogById = async function (sellerID) {
  const user = await User.findById(sellerID);
  if (!user || user.role !== 'seller') throw new Error('Seller not found.');
  const catalog = await this.findOne({ seller: sellerID })
    .select('seller products -_id');
  return catalog;
};

//static method to push products to a new/existing catalog.
catalogSchema.statics.createCatalog = async function (sellerID, name, price, quantity, description) {
  const catalog = await this.findOne({ seller: sellerID });
  //if catalog exists
  if (catalog) {
    const productIndex = catalog.products.findIndex(product => product.name === name);
    //if the product doesn't exist, add it to the catalog
    if (productIndex === -1) {
      catalog.products.push({ name, price, quantity, description });
      await catalog.save();
    }
    return catalog;
  } else {
    //if catalog doesn't exist
    const newCatalog = await this.create({ seller: sellerID, products: [{ name, price, quantity, description }] })
    User.findById(sellerID).then(async res => {
      res.catalog.push(newCatalog._id);
      await res.save();
    })
    return newCatalog;
  }
};

//static method to update products in a catalog
catalogSchema.statics.updateCatalog = async function (sellerID, name, price, quantity) {
  const catalog = await this.retrieveCatalog(sellerID);
  const productIndex = await catalog.retrieveProductIndex(name);
  const product = catalog.products[productIndex];
  product.name = name;
  product.quantity = parseInt(quantity);
  product.price = parseInt(price);
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
module.exports = mongoose.model('catalog', catalogSchema);