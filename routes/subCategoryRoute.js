const express = require("express");
const subCategoryController = require("../Controller/subCategoryController");

const router = express.Router({ mergeParams: true });
const subCategoryValidator = require("../utils/validators/subCategoryValidator");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(
    subCategoryController.createFilterObject,
    subCategoryValidator.getAllSubCategoryValidator,
    subCategoryController.getSubCategories
  )
  .post(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    subCategoryController.setCategoryRoute,
    subCategoryValidator.createSubCategoryValidator,
    subCategoryController.createSubCategory
  );

router
  .route("/:id")
  .get(
    subCategoryValidator.getSubCategoryValidator,
    subCategoryController.getSpecificSubCategory
  )
  .put(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("owner"),
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory
  );

module.exports = router;
