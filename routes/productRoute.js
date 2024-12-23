const express = require("express");
const productController = require("../Controller/productController");

const router = express.Router();
const productValidator = require("../utils/validators/productValidator");

router
  .route("/")
  .get(productController.getProducts)
  .post(
    productValidator.createProductValidator,
    productController.createProduct
  );

router
  .route("/:id")
  .get(
    productValidator.getProductValidator,
    productController.getSpecificProduct
  )
  .put(productValidator.updateProductValidator, productController.updateProduct)
  .delete(
    productValidator.deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
