/*
  Catalog implementation.  This assumes for now a product.json contains the valid 
  products and is validated outside of this implementation.  That is, JSON is valid, well-formed
  and contains the required fields.  
*/
const products = require("./data/products.json");

class Catalog {
  constructor() {
    this.products = products;
  }

  // This should return ALL products
  getCatalog() {
    return this.products;
  }

  //Products with 0 quantity are filtered out because they can't be added to carts
  getAvailableProducts() {
    return this.products.filter((product) => product.quantity > 0);
  }

  //Search for a given product
  findProduct(id) {
    const list = this.products.filter((product) => product.id === id);
    return list.length > 0 ? list[0] : null;
  }

  //Helper function to check if a product ID is in the list
  isProductAvailable(id) {
    const product = this.findProduct(id);
    if (product) {
      return product.quantity > 0;
    }
    return false;
  }

  //Get a product details.  Make sure it is available (quantity > 0) first!
  getProduct(id) {
    if (this.isProductAvailable(id)) {
      return this.findProduct(id);
    } else throw new Error("Product not found/available");
  }

  //Update the quantity value of a product.  Any quantity of 1 should change to 0
  updateProductCount(id) {
    if (this.isProductAvailable(id)) {
      let product = this.findProduct(id);
      product = {
        ...product,
        quantity: 0,
      };
      this.products = {
        ...this.products,
        ...product,
      };
    } else {
      throw Error(`Product ${id} not found in catalog!`);
    }
  }
}
module.exports = Catalog;
