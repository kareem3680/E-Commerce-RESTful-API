const express = require("express");

const router = express.Router();

const cartController = require("../Controller/cartController");
const cartValidator = require("../utils/validators/cartValidator");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("user"),
    cartController.getAllProductsInCart
  )
  .post(
    authController.protect,
    authController.allowedTo("user"),
    cartValidator.addProductToCartValidator,
    cartController.addProductToCart
  )
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    cartController.clearCart
  );

router
  .route("/applyCoupon")
  .put(
    authController.protect,
    authController.allowedTo("user"),
    cartValidator.applyCouponToCartValidator,
    cartController.applyCouponToCart
  );

router
  .route("/:id")
  .put(
    authController.protect,
    authController.allowedTo("user"),
    cartValidator.updateProductQuantityInCartValidator,
    cartController.updateProductQuantityInCart
  )
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    cartValidator.removeProductFromCartValidator,
    cartController.removeProductFromCart
  );
module.exports = router;
