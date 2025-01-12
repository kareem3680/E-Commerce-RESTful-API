const express = require("express");

const router = express.Router();

const brandController = require("../Controller/brandController");
const brandValidator = require("../utils/validators/brandValidator");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    brandValidator.createBrandValidator,
    brandController.resizeImage,
    brandController.createBrand
  );

router
  .route("/:id")
  .get(brandValidator.getBrandValidator, brandController.getSpecificBrand)
  .put(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    brandValidator.updateBrandValidator,
    brandController.resizeImage,
    brandController.updateBrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("owner"),
    brandValidator.deleteBrandValidator,
    brandController.deleteBrand
  );

module.exports = router;
