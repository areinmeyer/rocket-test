# Rocket Mortgage API implementation test

Implement an API for a Catalog and Shopping Cart given a list of products in JSON format.

## Routes
* `/catalog/size`
  * Returns JSON of the total size of the catalog
  * Assumd that ALL items, even quantity 0 should be included
* `/catalog/:id`
  * Return the details of a catalog item
* `/cart`
  * Return the current state of the cart
* `/cart/item/:id`
  * GET/POST/DELETE options
  * GET returns the item (if found) in the cart
  * POST adds an item (once!) to the cart
  * DELETE removes an item from the cart
* `/cart/checkout`
  * Return the contents of the cart, reset cart to empty as a "checkout" action
* `/cart/reset`
  * Helper route for use in testing harness

## To run project
Clone project locally then in the root project folder do the following:
```
npm install
npm run dev
```

## Scripts
`npm run dev` Runs a developer server that will restart as changes are made to any files in the project.

`npm run start` Runs a server that does not restart when changes are made

`npm run test` Runs a test suite