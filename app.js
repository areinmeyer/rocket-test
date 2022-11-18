/*
  Application routes and main logic
  Instantiate Catalog and Shopping carts here so state is managed in 1 file.

*/
const express = require("express");
const Catalog = require("./catalog.js");
const ShoppingCart = require("./cart.js");
const app = express();
const catalog = new Catalog();
const cart = new ShoppingCart();

function notFoundHandler(err, res, req) {
  console.log(`Route not found`);
  return res.status(404).json({
    success: false,
  });
}

// Return count of the catalog size.
// The Catalog should include all products.
app.get("/catalog/size", (req, res) => {
  const products = catalog.getAvailableProducts();
  if (products) {
    console.log(`GET catalog size success`);
    return res.status(200).json({
      success: true,
      count: Object.keys(products).length,
    });
  } else next("Catalog not available");
});

//Get a catalog item or indicate not found
app.get("/catalog/:id", (req, res) => {
  const { id = "not found" } = req.params;
  try {
    const product = catalog.getProduct(id);
    console.log(`GET catalog ${id} success`);
    return res.status(200).json({
      products: [product],
      success: true,
    });
  } catch (e) {
    console.log(`GET catalog ${id} not found`);
    res.status(404);
    return res.json({ sucess: false });
  }
});

//Get the current contents of a cart
//An empty cart is not an error, just returns a mostly empty object
app.get("/cart", (req, res) => {
  const currCart = cart.show();
  console.log(`GET cart success`);
  return res.status(200).json({
    ...currCart,
    success: true,
  });
});

//Get a item out of the cart
//Items not found in cart return 404
app.get("/cart/item/:id", (req, res) => {
  const { id } = req.params;
  try {
    const item = cart.getItem(id);
    console.log(`GET cart/item success ${id}`, item);
    return res.status(200).json({
      products: [item],
      success: true,
    });
  } catch (e) {
    console.log(`GET cart/item not found ${id}`);
    return res.status(404).json({
      success: false,
    });
  }
});

//Add an item to a cart
//User cannot add the same item twice in the cart.
//Only items that exist in product can be added
app.post("/cart/item/:id", (req, res) => {
  const { id } = req.params;
  let err = "";
  try {
    const product = catalog.getProduct(id);
    if (cart.isProductInCart(id)) {
      //Used to distinquish between a Not found and Added twice error
      err = "501";
      throw new Error(`Product ${id} is already in cart!`);
    }
    cart.addProduct(product);
    console.log(`POST add cart item ${id} success`);
    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    if (err === "501") {
      console.log(`POST add cart ${id} failed, item already in cart!`);
      return res.status(501).json({ success: false });
    }
    console.log(`POST add cart ${id} failed, item not found!`);
    return res.status(404).json({
      success: false,
    });
  }
});

//Delete a cart item.
//It is a failure to delete an item that does not exist in the cart
app.delete("/cart/item/:id", (req, res) => {
  const { id } = req.params;
  try {
    cart.removeItem(id);
    console.log(`DELETE cart item ${id} success`);
    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    console.log(`DELETE cart item ${id} failed, not found`);
    return res.status(404).json({
      success: false,
    });
  }
});

//Checkout the cart, resetting to empty once done.
//Here it is a failure to checkout an empty cart
app.post("/cart/checkout", (req, res) => {
  const currCart = cart.show();
  if (currCart) {
    console.log("POST cart checkout success");
    cart.reset();
    return res.status(200).json({
      ...currCart,
      success: true,
    });
  } else {
    console.log("POST cart checkout failed, cart is empty!");
    return res.status(501).json({
      success: false,
    });
  }
});

//Reset the cart to empty
//This is largely used in testing to reset the cart between tests.  
//Could be handy for a user though in a UI to clear their carts.
app.post("/cart/reset", (req, res) => {
  cart.reset();
  console.log("POST cart reset to empty");
  return res.status(200).json({ success: true });
});

app.use(notFoundHandler);

module.exports = app;
