const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");
const categoryController = require("../Controller/categoryController");

const router = express.Router();
const categoryValidator = require("../utils/validators/categoryValidator");

router.use("/:categoryId/sub-categories", subCategoryRoute);

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    categoryValidator.createCategoryValidator,
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(
    categoryValidator.getCategoryValidator,
    categoryController.getSpecificCategory
  )
  .put(
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
