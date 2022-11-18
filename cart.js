/*
  Shopping Cart implementation.  A Shopping cart consists of a basket and totalCost.
  It is assumed that calling routes will first validate that a product is in a valid state.
  Given more time, a Typescript implementation would validate a product interface.

  Functions in this class throw Errors when items are not in the basket, etc. Routes
  then will handle the errors as appropriate.

  Using a Map might also be beneficial here?  Where the Map key is the id and then 
  the full object is stored as the key.  
*/
class ShoppingCart {
  constructor() {
    this.basket = [];
    this.totalCost = 0;
  }

  // Assumption is product param is a valid product.
  // This should be validated if production code.
  addProduct(product) {
    this.basket.push(product);
    this.totalCost = this.totalCost + product.price;
  }

  //Return a cart item and error if it's not found
  getItem(id) {
    const products = this.basket.filter((item) => item.id === id);
    if (products.length > 0) {
      return products[0];
    } else throw new Error(`Product ${id} is not in the cart!`);
  }

  //Remove a cart item.  If it was not in the cart, throw an Error
  removeItem(id) {
    if (this.isProductInCart(id)) {
      const deletedItem = this.getItem(id);
      this.basket = this.basket.filter((item) => item.id != id);
      this.totalCost = this.totalCost - deletedItem.price;
    } else {
      throw new Error(`Product ${id} not in cart!`);
    }
  }

  //A helper function to determine if a product is in the cart already
  isProductInCart(id) {
    const list = this.basket.filter((product) => product.id === id);
    if (list.length > 0) return true;
    else return false;
  }

  //Essentially a "print" function to return the contents of the cart
  show() {
    if (this.basket.length > 0) {
      return {
        products: this.basket,
        totalCost: this.totalCost,
      };
    } else return null;
  }

  //Reset the cart to empty
  reset() {
    this.basket = [];
    this.totalCost = 0;
  }
}

module.exports = ShoppingCart;
