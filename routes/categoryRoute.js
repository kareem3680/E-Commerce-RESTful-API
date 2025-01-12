const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");
const categoryController = require("../Controller/categoryController");
const authController = require("../Controller/authController");

const router = express.Router();
const categoryValidator = require("../utils/validators/categoryValidator");

router.use("/:categoryId/sub-categories", subCategoryRoute);

router
  .route("/")
  .get(categoryController.getCategories)
  .post(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    categoryValidator.createCategoryValidator,
    categoryController.resizeImage,
    categoryController.createCategory
  );

router
  .route("/:id")
  .get(
    categoryValidator.getCategoryValidator,
    categoryController.getSpecificCategory
  )
  .put(
    authController.protect,
    authController.allowedTo("owner", "admin"),
    categoryValidator.updateCategoryValidator,
    categoryController.resizeImage,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("owner"),
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory
  );

module.exports = router;
