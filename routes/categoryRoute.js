const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");
const categoryController = require("../Controller/categoryController");

const router = express.Router();
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

router.use("/:categoryId/sub-categories", subCategoryRoute);

router
  .route("/")
  .get(categoryController.getCategories)
  .post(createCategoryValidator, categoryController.createCategory);

router
  .route("/:id")
  .get(getCategoryValidator, categoryController.getSpecificCategory)
  .put(updateCategoryValidator, categoryController.updateCategory)
  .delete(deleteCategoryValidator, categoryController.deleteCategory);

module.exports = router;
