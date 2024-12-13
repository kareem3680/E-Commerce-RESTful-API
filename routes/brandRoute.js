const express = require("express");
const brandController = require("../Controller/brandController");

const router = express.Router();
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

router
  .route("/")
  .get(brandController.getBrands)
  .post(createBrandValidator, brandController.createBrand);

router
  .route("/:id")
  .get(getBrandValidator, brandController.getSpecificBrand)
  .put(updateBrandValidator, brandController.updateBrand)
  .delete(deleteBrandValidator, brandController.deleteBrand);

module.exports = router;
