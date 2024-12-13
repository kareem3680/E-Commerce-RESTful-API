const express = require("express");
const subCategoryController = require("../Controller/subCategoryController");

const router = express.Router({ mergeParams: true });
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

router
  .route("/")
  .get(
    subCategoryController.createFilterObject,
    subCategoryController.getSubCategories
  )
  .post(
    subCategoryController.setCategoryRoute,
    createSubCategoryValidator,
    subCategoryController.createSubCategory
  );

router
  .route("/:id")
  .get(getSubCategoryValidator, subCategoryController.getSpecificSubCategory)
  .put(updateSubCategoryValidator, subCategoryController.updateSubCategory)
  .delete(deleteSubCategoryValidator, subCategoryController.deleteSubCategory);

module.exports = router;
