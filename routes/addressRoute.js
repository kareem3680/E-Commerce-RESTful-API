const express = require("express");
const addressController = require("../Controller/addressController");

const router = express.Router();
const authController = require("../Controller/authController");
const addressValidator = require("../utils/validators/addressValidator");

router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("user"),
    addressController.getAllAddresses
  )
  .post(
    authController.protect,
    authController.allowedTo("user"),
    addressValidator.addAddressValidator,
    addressController.addAddress
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedTo("user"),
    addressValidator.removeAddressValidator,
    addressController.removeAddress
  );

module.exports = router;
