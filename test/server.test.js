const request = require("supertest");
const { post } = require("../app");
let app = require("../app");

const product002 = {
  name: "stool",
  price: 57,
  id: "002",
  quantity: 1,
};

const product020 = {
  name: "wallet",
  price: 108,
  id: "020",
  quantity: 1,
};

describe("Catalog", function () {
  describe("GET /catalog/size", function () {
    it("should return the catalog size", function () {
      return request(app)
        .get("/catalog/size")
        .expect(200)
        .expect({ count: 94, success: true });
    });
  });
  describe("GET /catalog/item", function () {
    it("should return a found item", function () {
      return request(app)
        .get("/catalog/002")
        .expect(200)
        .expect({ products: [product002], success: true });
    });
    it("should fail when item id not found", function () {
      return request(app)
        .get("/cataglog/aaa")
        .expect(404)
        .expect({ success: false });
    });
  });
});

describe("Cart", function () {
  describe("POST /cart/item/002", function () {
    it("adds an item to the cart", function () {
      return request(app)
        .post("/cart/item/002")
        .expect(200)
        .expect("Content-Type", /json/)
        .expect({ success: true });
    });
    it("does not add an item to cart when item is not found", function () {
      return request(app)
        .post("/cart/item/aaa")
        .expect(404)
        .expect({ success: false });
    });
    it("should return a failure when adding item a second time", function () {
      return request(app)
        .post("/cart/item/020")
        .expect(200)
        .then(function () {
          return request(app)
            .post("/cart/item/020")
            .expect(501)
            .expect({ success: false });
        });
    });
  });

  describe("GET /cart/item/002", function () {
    it("should return the item when it is in the cart", function () {
      return request(app)
        .get("/cart/item/002")
        .expect(200)
        .expect({ products: [product002], success: true });
    });
    it("should return not found when item not in the cart", function () {
      return request(app)
        .get("/cart/item/100")
        .expect(404)
        .expect({ success: false });
    });
  });

  describe("DELETE /cart/item/002", function () {
    before(function () {
      return request(app).post("/cart/reset");
    });
    it("should delete cart item that is in cart", function () {
      return request(app)
        .post("/cart/item/002")
        .expect(200)
        .then(function () {
          return request(app)
            .delete("/cart/item/002")
            .expect(200)
            .expect({ success: true });
        });
    });
    it("should fail to delete cart item that is not in cart", function () {
      return request(app)
        .delete("/cart/item/002")
        .expect(404)
        .expect({ success: false });
    });
    it("should fail when deleting cart item second time", function () {
      return request(app)
        .post("/cart/item/002")
        .expect(200)
        .then(function () {
          return request(app)
            .delete("/cart/item/002")
            .expect(200)
            .expect({ success: true })
            .then(function () {
              return request(app)
                .delete("/cart/item/002")
                .expect(404)
                .expect({ success: false });
            });
        });
    });
  });

  describe("checkout cart with 1 item", function () {
    before(function () {
      return request(app).post("/cart/reset");
    });
    it("should checkout when cart has 1 or more items", function () {
      return request(app)
        .post("/cart/item/020")
        .expect(200)
        .expect({ success: true })
        .then(function () {
          return request(app)
            .post("/cart/checkout")
            .expect(200)
            .expect({
              products: [product020],
              success: true,
              totalCost: product020.price,
            });
        });
    });
  });
});
