const express = require("express");
const brandController = require("../Controller/brandController");

const router = express.Router();
const brandValidator = require("../utils/validators/brandValidator");

router
  .route("/")
  .get(brandController.getBrands)
  .post(
    brandValidator.createBrandValidator,
    brandController.resizeImage,
    brandController.createBrand
  );

router
  .route("/:id")
  .get(brandValidator.getBrandValidator, brandController.getSpecificBrand)
  .put(
    brandValidator.updateBrandValidator,
    brandController.resizeImage,
    brandController.updateBrand
  )
  .delete(brandValidator.deleteBrandValidator, brandController.deleteBrand);

module.exports = router;
