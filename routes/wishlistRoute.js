const express = require("express");
const wishlistController = require("../Controller/wishlistController");

const router = express.Router();
const wishlistValidator = require("../utils/validators/wishlistValidator");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("user"),
    wishlistController.getAllWishlists
  )
  .post(
    authController.protect,
    authController.allowedTo("user"),
    wishlistValidator.addProductToWishlistValidator,
    wishlistController.addProductToWishlist
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    wishlistValidator.removeProductFromWishlistValidator,
    wishlistController.removeProductFromWishlist
  );

module.exports = router;
