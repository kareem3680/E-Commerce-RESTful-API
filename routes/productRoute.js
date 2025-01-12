const express = require("express");
const productController = require("../Controller/productController");

const router = express.Router();
const productValidator = require("../utils/validators/productValidator");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    productValidator.createProductValidator,
    productController.resizeImage,
    productController.createProduct
  );

router
  .route("/:id")
  .get(
    productValidator.getProductValidator,
    productController.getSpecificProduct
  )
  .put(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    productValidator.updateProductValidator,
    productController.resizeImage,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("owner"),
    productValidator.deleteProductValidator,
    productController.deleteProduct
  );

module.exports = router;
