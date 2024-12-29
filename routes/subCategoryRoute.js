const express = require("express");
const subCategoryController = require("../Controller/subCategoryController");

const router = express.Router({ mergeParams: true });
const subCategoryValidator = require("../utils/validators/subCategoryValidator");

router
  .route("/")
  .get(
    subCategoryController.createFilterObject,
    subCategoryValidator.getAllSubCategoryValidator,
    subCategoryController.getSubCategories
  )
  .post(
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
    subCategoryValidator.updateSubCategoryValidator,
    subCategoryController.updateSubCategory
  )
  .delete(
    subCategoryValidator.deleteSubCategoryValidator,
    subCategoryController.deleteSubCategory
  );

module.exports = router;
