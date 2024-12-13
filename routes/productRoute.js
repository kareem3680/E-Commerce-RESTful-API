const express = require("express");
const productController = require("../Controller/productController");

const router = express.Router();
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

router
  .route("/")
  .get(productController.getProducts)
  .post(createProductValidator, productController.createProduct);

router
  .route("/:id")
  .get(getProductValidator, productController.getSpecificProduct)
  .put(updateProductValidator, productController.updateProduct)
  .delete(deleteProductValidator, productController.deleteProduct);

module.exports = router;
